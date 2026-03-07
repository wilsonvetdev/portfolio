"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Room from "@/components/poker/Room";

const PARTY_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export default function PokerRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("poker-name");
    if (!stored) {
      router.push("/poker");
      return;
    }
    setPlayerName(stored);
  }, [router]);

  if (!playerName) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <Room roomId={roomId} playerName={playerName} partyHost={PARTY_HOST} />
  );
}
