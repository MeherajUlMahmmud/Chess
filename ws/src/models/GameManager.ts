import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "../utils/constants";

export class GameManager {
	private games: Game[];
	private pendingUser: WebSocket | null;
	private users: WebSocket[];

	constructor() {
		this.games = [];
		this.pendingUser = null;
		this.users = [];
	}

	addUser(socket: WebSocket) {
		this.users.push(socket);
		this.addHandler(socket);
	}

	removeUser(socket: WebSocket) {
		this.users = this.users.filter((user) => user !== socket);
		// Stop the game here because the user left
	}

	private addHandler(socket: WebSocket) {
		socket.on("message", (data) => {
			const message = JSON.parse(data.toString());

			if (message.type === INIT_GAME) {
				if (this.pendingUser) {
					const game = new Game(this.pendingUser, socket);
					this.games.push(game);
					this.pendingUser = null;
				} else {
					this.pendingUser = socket;
				}
			}

			console.log("Message", message);

			if (message.type === MOVE) {
				console.log("inside move");
				const game = this.games.find(
					(game) => game.player1 === socket || game.player2 === socket
				);
				if (game) {
					console.log("inside make move");
					game.makeMove(socket, message.move);
				}
			}
		});
	}
}
