"use client";

import { CheckCircle, Clock } from "lucide-react";
import type { Player } from "@/lib/poker-types";

interface PlayerListProps {
  players: Record<string, Player>;
  revealed: boolean;
  currentPlayerId: string;
}

export default function PlayerList({
  players,
  revealed,
  currentPlayerId,
}: PlayerListProps) {
  const playerList = Object.values(players);

  if (playerList.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-4">
        Waiting for players to join...
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {playerList.map((player) => {
        const isYou = player.id === currentPlayerId;
        const hasVoted = player.vote !== null;

        return (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-secondary">
                {player.name}
                {isYou && (
                  <span className="ml-1.5 text-xs text-muted">(you)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {revealed && hasVoted ? (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-lg">
                  {player.vote}
                </span>
              ) : hasVoted ? (
                <span className="inline-flex items-center gap-1 text-sm text-primary">
                  <CheckCircle size={16} /> Voted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-muted">
                  <Clock size={16} /> Thinking...
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
