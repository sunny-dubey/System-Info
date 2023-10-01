import * as WebSocket from 'ws';
import wss from '../app'
import {fetchCpuUsage, fetchMemoryUsage} from "../utils/systemInfo"
import { Server } from 'http'; // Import Server from 'http'


export const sendStreamDatatoWebSocket = (streamId: string, type: string): void=>{
  
  console.log("manas")
  const interval = setInterval(()=>{
    if(wss.clients.size==0){
      console.log("zero client")
      clearInterval(interval);
      return;
    }
    let systemInfo: number;


  if(type=='cpu'){
    systemInfo = fetchCpuUsage();  
  }else{
    systemInfo = fetchMemoryUsage();
  }

    const dataToSend = JSON.stringify({
      streamId, type, systemInfo, timestamp: new Date()
    });

    wss.clients.forEach((client)=>{
      if(client.readyState===WebSocket.OPEN){
        client.send(dataToSend)
      }
    })
  },100)
}

