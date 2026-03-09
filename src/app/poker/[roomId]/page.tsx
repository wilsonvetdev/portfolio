"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Room from "@/components/poker/Room";
import type { Role } from "@/lib/poker-types";

const PARTY_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export default function PokerRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem("poker-name");
    const storedRole = sessionStorage.getItem("poker-role") as Role | null;
    if (!storedName || !storedRole) {
      router.push(`/poker?room=${roomId}`);
      return;
    }
    setPlayerName(storedName);
    setRole(storedRole);
  }, [router]);

  if (!playerName || !role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <Room
      roomId={roomId}
      playerName={playerName}
      role={role}
      partyHost={PARTY_HOST}
    />
  );
}
