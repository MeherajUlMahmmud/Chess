import { WebSocketServer } from "ws";
import { GameManager } from "./models/GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
	console.log("user connected", ws);
	gameManager.addUser(ws);

	ws.on("disconnect", () => {
		gameManager.removeUser(ws);
		console.log("user disconnected");
	});
});
