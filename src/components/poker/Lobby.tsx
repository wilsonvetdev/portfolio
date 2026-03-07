"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, LogIn } from "lucide-react";

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function Lobby() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const roomId = generateRoomId();
    sessionStorage.setItem("poker-name", name.trim());
    router.push(`/poker/${roomId}`);
  }

  function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;
    sessionStorage.setItem("poker-name", name.trim());
    router.push(`/poker/${roomCode.trim()}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
          <Users size={32} />
        </div>
        <h1 className="text-3xl font-bold text-secondary">Planning Poker</h1>
        <p className="text-muted mt-2">
          Estimate stories with your team in real-time
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form onSubmit={handleCreate}>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 py-3 font-semibold hover:bg-primary-dark disabled:opacity-40 transition-colors"
            >
              <Plus size={18} /> Create Room
            </button>
          </form>

          <form onSubmit={handleJoin} className="space-y-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Room code"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!name.trim() || !roomCode.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-secondary text-secondary px-6 py-3 font-semibold hover:bg-secondary hover:text-white disabled:opacity-40 transition-colors"
            >
              <LogIn size={18} /> Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
