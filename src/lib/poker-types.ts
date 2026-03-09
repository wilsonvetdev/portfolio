export const CARD_VALUES = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "?",
] as const;

export type CardValue = (typeof CARD_VALUES)[number];

export type Role = "facilitator" | "player" | "observer";

export interface Player {
  id: string;
  name: string;
  role: Role;
  vote: CardValue | null;
}

export interface RoomState {
  players: Record<string, Player>;
  facilitatorId: string | null;
  topic: string;
  revealed: boolean;
}

export type ClientMessage =
  | { type: "join"; name: string; role: Role }
  | { type: "vote"; value: CardValue }
  | { type: "reveal" }
  | { type: "reset" }
  | { type: "set-topic"; topic: string };

export type ServerMessage =
  | { type: "state"; state: RoomState }
  | { type: "error"; message: string };
