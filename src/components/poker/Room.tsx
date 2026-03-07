"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import usePartySocket from "partysocket/react";
import Card from "./Card";
import PlayerList from "./PlayerList";
import { CARD_VALUES, type CardValue, type RoomState, type ServerMessage } from "@/lib/poker-types";
import { Eye, RotateCcw, Copy, Check, BarChart3 } from "lucide-react";

interface RoomProps {
  roomId: string;
  playerName: string;
  partyHost: string;
}

function computeStats(players: RoomState["players"]) {
  const votes = Object.values(players)
    .map((p) => p.vote)
    .filter((v): v is CardValue => v !== null && v !== "?");

  const numeric = votes.map(Number).filter((n) => !isNaN(n));
  if (numeric.length === 0) return null;

  const avg = numeric.reduce((a, b) => a + b, 0) / numeric.length;
  const sorted = [...numeric].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  return {
    average: Math.round(avg * 10) / 10,
    median,
    total: votes.length,
    questionMarks: Object.values(players).filter((p) => p.vote === "?").length,
  };
}

export default function Room({ roomId, playerName, partyHost }: RoomProps) {
  const [state, setState] = useState<RoomState>({
    players: {},
    topic: "",
    revealed: false,
  });
  const [myVote, setMyVote] = useState<CardValue | null>(null);
  const [copied, setCopied] = useState(false);
  const joinedRef = useRef(false);

  const socket = usePartySocket({
    host: partyHost,
    room: roomId,
    onMessage(evt) {
      const msg: ServerMessage = JSON.parse(evt.data);
      if (msg.type === "state") {
        setState(msg.state);
      }
    },
  });

  useEffect(() => {
    if (socket && !joinedRef.current) {
      socket.send(JSON.stringify({ type: "join", name: playerName }));
      joinedRef.current = true;
    }
  }, [socket, playerName]);

  const handleVote = useCallback(
    (value: CardValue) => {
      if (state.revealed) return;
      setMyVote(value);
      socket.send(JSON.stringify({ type: "vote", value }));
    },
    [socket, state.revealed]
  );

  const handleReveal = useCallback(() => {
    socket.send(JSON.stringify({ type: "reveal" }));
  }, [socket]);

  const handleReset = useCallback(() => {
    setMyVote(null);
    socket.send(JSON.stringify({ type: "reset" }));
  }, [socket]);

  const handleTopicChange = useCallback(
    (topic: string) => {
      socket.send(JSON.stringify({ type: "set-topic", topic }));
    },
    [socket]
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const stats = state.revealed ? computeStats(state.players) : null;
  const playerCount = Object.keys(state.players).length;
  const votedCount = Object.values(state.players).filter(
    (p) => p.vote !== null
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Planning Poker</h1>
          <p className="text-sm text-muted mt-1">
            Room: <code className="bg-card rounded px-1.5 py-0.5">{roomId}</code>
            <span className="mx-2">|</span>
            {playerCount} player{playerCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-card transition-colors"
        >
          {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="topic" className="block text-sm font-medium text-foreground/70 mb-1">
          Current Topic
        </label>
        <input
          id="topic"
          type="text"
          value={state.topic}
          onChange={(e) => handleTopicChange(e.target.value)}
          placeholder="What are we estimating?"
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">
              Pick Your Card
            </h2>
            <div className="flex flex-wrap gap-3">
              {CARD_VALUES.map((value) => (
                <Card
                  key={value}
                  value={value}
                  selected={myVote === value}
                  onClick={() => handleVote(value)}
                  disabled={state.revealed}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReveal}
              disabled={state.revealed || votedCount === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-secondary text-white px-5 py-2.5 text-sm font-semibold hover:bg-secondary-light disabled:opacity-40 transition-colors"
            >
              <Eye size={16} /> Reveal Cards ({votedCount}/{playerCount})
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-card transition-colors"
            >
              <RotateCcw size={16} /> New Round
            </button>
          </div>

          {stats && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="flex items-center gap-2 font-bold text-secondary mb-3">
                <BarChart3 size={18} className="text-primary" /> Results
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <Stat label="Average" value={String(stats.average)} />
                <Stat label="Median" value={String(stats.median)} />
                <Stat label="Votes" value={String(stats.total)} />
                {stats.questionMarks > 0 && (
                  <Stat label="Unsure" value={String(stats.questionMarks)} />
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">
            Players
          </h2>
          <PlayerList
            players={state.players}
            revealed={state.revealed}
            currentPlayerId={socket.id}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
