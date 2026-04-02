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
  type Player,
} from "@/lib/poker-types";
import { Eye, RotateCcw, Copy, Check, BarChart3, Users2, FlaskConical } from "lucide-react";

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

function computeVoteBreakdown(players: RoomState["players"]) {
  const groups: Record<string, { value: string; voters: string[] }> = {};

  for (const player of Object.values(players)) {
    if (player.role === "observer" || !player.vote) continue;
    const v = player.vote;
    if (!groups[v]) groups[v] = { value: v, voters: [] };
    groups[v].voters.push(player.name);
  }

  const numericOrder = ["0", "1", "2", "3", "5", "8", "13", "21", "?"];
  return Object.values(groups).sort(
    (a, b) => numericOrder.indexOf(a.value) - numericOrder.indexOf(b.value)
  );
}

const DUMMY_PLAYERS: Record<string, Player> = {
  "demo-1": { id: "demo-1", name: "Alice", role: "facilitator", vote: "5" },
  "demo-2": { id: "demo-2", name: "Bob", role: "player", vote: "5" },
  "demo-3": { id: "demo-3", name: "Carol", role: "player", vote: "8" },
  "demo-4": { id: "demo-4", name: "Dave", role: "player", vote: "3" },
  "demo-5": { id: "demo-5", name: "Eve", role: "player", vote: "5" },
  "demo-6": { id: "demo-6", name: "Frank", role: "observer", vote: null },
  "demo-7": { id: "demo-7", name: "Grace", role: "player", vote: "?" },
};

const DUMMY_STATE: RoomState = {
  players: DUMMY_PLAYERS,
  facilitatorId: "demo-1",
  topic: "As a user, I want to reset my password via email",
  revealed: true,
};

export default function Room({ roomId, playerName, role, partyHost }: RoomProps) {
  const [state, setState] = useState<RoomState>({
    players: {},
    facilitatorId: null,
    topic: "",
    revealed: false,
  });
  const [myVote, setMyVote] = useState<CardValue | null>(null);
  const [copied, setCopied] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const joinedRef = useRef(false);

  const socket = usePartySocket({
    host: partyHost,
    room: roomId,
    onMessage(evt) {
      const msg: ServerMessage = JSON.parse(evt.data);
      if (msg.type === "state" && !demoMode) {
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

  const activeState = demoMode ? DUMMY_STATE : state;
  const isFacilitator = demoMode
    ? true
    : socket.id === activeState.facilitatorId;
  const canVote = role !== "observer";

  const handleVote = useCallback(
    (value: CardValue) => {
      if (state.revealed || !canVote || demoMode) return;
      setMyVote(value);
      socket.send(JSON.stringify({ type: "vote", value }));
    },
    [socket, state.revealed, canVote, demoMode]
  );

  const handleReveal = useCallback(() => {
    if (demoMode) return;
    socket.send(JSON.stringify({ type: "reveal" }));
  }, [socket, demoMode]);

  const handleReset = useCallback(() => {
    if (demoMode) return;
    setMyVote(null);
    socket.send(JSON.stringify({ type: "reset" }));
  }, [socket, demoMode]);

  const handleTopicChange = useCallback(
    (topic: string) => {
      if (demoMode) return;
      socket.send(JSON.stringify({ type: "set-topic", topic }));
    },
    [socket, demoMode]
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleToggleDemo = useCallback(() => {
    setDemoMode((prev) => !prev);
  }, []);

  const stats = activeState.revealed ? computeStats(activeState.players) : null;
  const breakdown = activeState.revealed ? computeVoteBreakdown(activeState.players) : null;
  const voters = Object.values(activeState.players).filter((p) => p.role !== "observer");
  const playerCount = voters.length;
  const votedCount = voters.filter((p) => p.vote !== null).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            Planning Poker
            {demoMode && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2.5 py-0.5 text-xs font-semibold">
                Demo Mode
              </span>
            )}
          </h1>
          <p className="text-sm text-muted mt-1">
            Room: <code className="bg-card rounded px-1.5 py-0.5">{roomId}</code>
            <span className="mx-2">|</span>
            {Object.keys(activeState.players).length} participant{Object.keys(activeState.players).length !== 1 ? "s" : ""}
            {isFacilitator && !demoMode && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                Facilitator
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleDemo}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              demoMode
                ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-border text-muted hover:bg-card hover:text-secondary"
            }`}
          >
            <FlaskConical size={16} /> {demoMode ? "Exit Demo" : "Demo"}
          </button>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-card transition-colors"
          >
            {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Invite Link"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="topic" className="block text-sm font-medium text-foreground/70 mb-1">
          Current Topic
        </label>
        {isFacilitator && !demoMode ? (
          <input
            id="topic"
            type="text"
            value={activeState.topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            placeholder="What are we estimating?"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        ) : (
          <div className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground min-h-[48px]">
            {activeState.topic || <span className="text-muted">No topic set yet</span>}
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
                    disabled={activeState.revealed || demoMode}
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

          {isFacilitator && !demoMode && (
            <div className="flex gap-3">
              <button
                onClick={handleReveal}
                disabled={activeState.revealed || votedCount === 0}
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
                <BarChart3 size={18} className="text-primary" /> Summary
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

          {breakdown && breakdown.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="flex items-center gap-2 font-bold text-secondary mb-4">
                <Users2 size={18} className="text-primary" /> Vote Breakdown
              </h3>
              <div className="space-y-3">
                {breakdown.map((group) => (
                  <div key={group.value} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-primary text-white font-bold text-lg">
                      {group.value}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-secondary">
                        {group.voters.length} vote{group.voters.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {group.voters.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center rounded-full bg-card border border-border px-2.5 py-0.5 text-xs font-medium text-foreground/70"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">
            Participants
          </h2>
          <PlayerList
            players={activeState.players}
            revealed={activeState.revealed}
            currentPlayerId={demoMode ? "demo-1" : socket.id}
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
