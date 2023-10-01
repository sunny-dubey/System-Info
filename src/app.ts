import express, {Request,Response} from 'express';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import router from './routes/streamRoutes';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({noServer:true});

// middleware
app.use(express.json());
app.use('/api', router);

// testing routes
app.get("/", (req:Request,res:Response)=>{
  const readmePath = 'README.md';
  const data = fs.readFileSync(readmePath, 'utf-8');
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(data);
})

// websocket endpoint
wss.on('connection', (ws:WebSocket)=>{
  console.log("websocket connection established");

  ws.on('message', (message:string)=>{
    ws.send(`received message ${message}`);
    console.log(`received message from client ${message}`);
    //broadcast message to all clients
    // wss.clients.forEach((client) => {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(`Broadcast: ${message}`);
    //   }
    // });
    
  })
  
  ws.on('close', ()=>{
    console.log('websocket connection closed');
  })

  ws.send('welcome to the websocket server!')
})

// Integrate WebSocket with the existing server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT || 3000;

// start the server
server.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`);
})

export default wss;