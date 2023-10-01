"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const streamRoutes_1 = __importDefault(require("./routes/streamRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ noServer: true });
// middleware
app.use(express_1.default.json());
app.use('/api', streamRoutes_1.default);
// testing routes
app.get("/", (req, res) => {
    const websocket = new ws_1.default("ws://localhost:3000");
    websocket.addEventListener('open', () => {
        websocket.send("dushyant ");
    });
    res.send("this is a test route");
});
// websocket endpoint
wss.on('connection', (ws) => {
    console.log("websocket connection established");
    ws.on('message', (message) => {
        ws.send(`received message ${message}`);
        console.log(`received message from client ${message}`);
        //broadcast message to all clients
        // wss.clients.forEach((client) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(`Broadcast: ${message}`);
        //   }
        // });
    });
    ws.on('close', () => {
        console.log('websocket connection closed');
    });
    ws.send('welcome to the websocket server!');
});
// Integrate WebSocket with the existing server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
const PORT = process.env.PORT || 3000;
// start the server
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
exports.default = wss;
