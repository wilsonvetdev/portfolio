import type * as Party from "partykit/server";
import type {
  ClientMessage,
  ServerMessage,
  RoomState,
  Player,
} from "../src/lib/poker-types";

export default class PokerRoom implements Party.Server {
  private state: RoomState = {
    players: {},
    facilitatorId: null,
    topic: "",
    revealed: false,
  };

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    this.sendTo(conn, { type: "state", state: this.getVisibleState() });
  }

  onClose(conn: Party.Connection) {
    const wasFacilitator = conn.id === this.state.facilitatorId;
    delete this.state.players[conn.id];

    if (wasFacilitator) {
      const remaining = Object.keys(this.state.players);
      this.state.facilitatorId = remaining.length > 0 ? remaining[0] : null;
      if (this.state.facilitatorId) {
        this.state.players[this.state.facilitatorId].role = "facilitator";
      }
    }

    this.broadcastState();
  }

  onMessage(message: string, sender: Party.Connection) {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }

    switch (msg.type) {
      case "join": {
        const isFirstPlayer = this.state.facilitatorId === null;
        const role = isFirstPlayer ? "facilitator" : msg.role;

        this.state.players[sender.id] = {
          id: sender.id,
          name: msg.name,
          role,
          vote: null,
        };

        if (isFirstPlayer) {
          this.state.facilitatorId = sender.id;
        }
        break;
      }
      case "vote": {
        const player = this.state.players[sender.id];
        if (!player || this.state.revealed) break;
        if (player.role === "observer") break;
        player.vote = msg.value;
        break;
      }
      case "reveal": {
        if (sender.id !== this.state.facilitatorId) break;
        this.state.revealed = true;
        break;
      }
      case "reset": {
        if (sender.id !== this.state.facilitatorId) break;
        this.state.revealed = false;
        for (const player of Object.values(this.state.players)) {
          player.vote = null;
        }
        break;
      }
      case "set-topic": {
        if (sender.id !== this.state.facilitatorId) break;
        this.state.topic = msg.topic;
        break;
      }
    }

    this.broadcastState();
  }

  private getVisibleState(): RoomState {
    if (this.state.revealed) return this.state;

    const masked: Record<string, Player> = {};
    for (const [id, player] of Object.entries(this.state.players)) {
      masked[id] = {
        ...player,
        vote: player.vote ? ("?" as const) : null,
      };
    }
    return { ...this.state, players: masked };
  }

  private broadcastState() {
    const stateToSend = this.state.revealed
      ? this.state
      : this.getVisibleState();
    const msg: ServerMessage = { type: "state", state: stateToSend };
    const data = JSON.stringify(msg);

    for (const conn of this.room.getConnections()) {
      conn.send(data);
    }
  }

  private sendTo(conn: Party.Connection, msg: ServerMessage) {
    conn.send(JSON.stringify(msg));
  }
}

PokerRoom satisfies Party.Worker;
