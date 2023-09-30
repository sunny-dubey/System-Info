import express, {Request,Response} from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

// middleware
app.use(express.json());

// testing routes
app.get("/", (req:Request,res:Response)=>{
  const websocket = new WebSocket("ws://localhost:3000");
  websocket.addEventListener('open', ()=>{
    console.log("we are connected")
    websocket.send("yo");
  })
  res.send("this is a test route");
})

// websocket endpoint
wss.on('connection', (ws:WebSocket)=>{
  console.log("websocket connection established");

  ws.on('message', (message:string)=>{
    ws.send(`received message ${message}`);
    console.log(`received message from client ${message}`);
    
    // need to display the message to the postman client
  })
  
  ws.on('close', ()=>{
    console.log('websocket connection closed');
  })

  ws.send('welcome to the websocket server!')
})


const PORT = process.env.PORT || 3000;

// start the server
server.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`);
})