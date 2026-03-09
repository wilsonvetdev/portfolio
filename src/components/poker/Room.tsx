"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import usePartySocket from "partysocket/react";
import Card from "./Card";
import PlayerList from "./PlayerList";
import {
  CARD_VALUES,
  type CardValue,
  type Role,
  type RoomState,
  type ServerMessage,
} from "@/lib/poker-types";
import { Eye, RotateCcw, Copy, Check, BarChart3 } from "lucide-react";

interface RoomProps {
  roomId: string;
  playerName: string;
  role: Role;
  partyHost: string;
}

function computeStats(players: RoomState["players"]) {
  const votes = Object.values(players)
    .filter((p) => p.role !== "observer")
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

export default function Room({ roomId, playerName, role, partyHost }: RoomProps) {
  const [state, setState] = useState<RoomState>({
    players: {},
    facilitatorId: null,
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
      socket.send(JSON.stringify({ type: "join", name: playerName, role }));
      joinedRef.current = true;
    }
  }, [socket, playerName, role]);

  const isFacilitator = socket.id === state.facilitatorId;
  const canVote = role !== "observer";

  const handleVote = useCallback(
    (value: CardValue) => {
      if (state.revealed || !canVote) return;
      setMyVote(value);
      socket.send(JSON.stringify({ type: "vote", value }));
    },
    [socket, state.revealed, canVote]
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
  const voters = Object.values(state.players).filter((p) => p.role !== "observer");
  const playerCount = voters.length;
  const votedCount = voters.filter((p) => p.vote !== null).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Planning Poker</h1>
          <p className="text-sm text-muted mt-1">
            Room: <code className="bg-card rounded px-1.5 py-0.5">{roomId}</code>
            <span className="mx-2">|</span>
            {Object.keys(state.players).length} participant{Object.keys(state.players).length !== 1 ? "s" : ""}
            {isFacilitator && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                Facilitator
              </span>
            )}
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
        {isFacilitator ? (
          <input
            id="topic"
            type="text"
            value={state.topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            placeholder="What are we estimating?"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        ) : (
          <div className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground min-h-[48px]">
            {state.topic || <span className="text-muted">No topic set yet</span>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {canVote ? (
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
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Eye size={24} className="mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">
                You are observing this session
              </p>
            </div>
          )}

          {isFacilitator && (
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
          )}

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
            Participants
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
