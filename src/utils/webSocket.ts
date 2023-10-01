import * as WebSocket from 'ws';
import wss from '../app'
import {fetchCpuUsage, fetchMemoryUsage} from "../utils/systemInfo"
import { Server } from 'http'; // Import Server from 'http'


export const sendStreamDatatoWebSocket = (streamId: string, type: string): void=>{
  
  console.log("manas")
  const interval = setInterval(()=>{
    if(wss.clients.size==0){
      //console.log("zero client")
      clearInterval(interval);
      return;
    }
    let systemInfo: number;

  let CPU_Usage: string;
  let Memory_Usage: string;
  let dataToSend: any;
  if(type=='cpu'){
    const systemInfo = fetchCpuUsage(); 
    CPU_Usage = systemInfo + " %";
     dataToSend = JSON.stringify({
      streamId, CPU_Usage, timestamp: new Date()
    });  
  }else{
    const systemInfo = fetchMemoryUsage();
    Memory_Usage = systemInfo + " MB";
     dataToSend = JSON.stringify({
      streamId, Memory_Usage, timestamp: new Date()
    });
  }
  wss.clients.forEach((client)=>{
    if(client.readyState===WebSocket.OPEN){
      client.send(dataToSend)
    }
  }) 

   
  },100)
}

