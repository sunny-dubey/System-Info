// // import * as WebSocket from 'ws';
// import wss from '../app'
// import {fetchCpuUsage, fetchMemoryUsage} from "../utils/systemInfo"
// import { Server } from 'http'; // Import Server from 'http'



// export const sendStreamDatatoWebSocket = (streamId: string, type: string): void=>{
  
//   const interval = setInterval(()=>{
//     if(wss.clients.size==0){
//       //console.log("zero client")
//       clearInterval(interval);
//       return;
//     }
//     let systemInfo: number;

//   let CPU_Usage: string;
//   let Memory_Usage: string;
//   let dataToSend: any;
//   if(type=='cpu'){
//     const systemInfo = fetchCpuUsage(); 
//     CPU_Usage = systemInfo + " %";
//      dataToSend = JSON.stringify({
//       streamId, CPU_Usage, timestamp: new Date()
//     });  
//     wss.clients.forEach((client)=>{
//       if(client.readyState===WebSocket.OPEN){
//         client.send(dataToSend)
//       }
//     }) 
//   }else{
//     const systemInfo = fetchMemoryUsage();
//     Memory_Usage = systemInfo + " MB";
//      dataToSend = JSON.stringify({
//       streamId, Memory_Usage, timestamp: new Date()
//     });
//     wss.clients.forEach((client)=>{
//       if(client.readyState===WebSocket.OPEN){
//         client.send(dataToSend)
//       }
//     }) 
//   }
    
//   },100)
// }


import * as WebSocket from 'ws';
import wss from '../app';
import { fetchCpuUsage, fetchMemoryUsage } from '../utils/systemInfo';

interface StreamInfo {
  intervalId?: NodeJS.Timeout;
}

const activeStreams: { [key: string]: StreamInfo } = {};

export const sendStreamDatatoWebSocket = (streamId: string, type: string): void => {
  const interval = setInterval(() => {
    // if (wss.clients.size === 0) {
    //   clearInterval(interval);
    //   return;
    // }

    let systemInfo: number;
    let dataToSend: any;

    if (type === 'cpu') {
      systemInfo = fetchCpuUsage();
      const CPU_Usage = systemInfo + ' %';
      dataToSend = JSON.stringify({
        streamId,
        CPU_Usage,
        timestamp: new Date(),
      });
    } else {
      systemInfo = fetchMemoryUsage();
      const Memory_Usage = systemInfo + ' MB';
      dataToSend = JSON.stringify({
        streamId,
        Memory_Usage,
        timestamp: new Date(),
      });
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataToSend);
      }
    });
  }, 100);

  // Save the intervalId in the activeStreams object
  activeStreams[streamId] = {
    intervalId: interval,
  };
  //console.log(activeStreams);
};

export const stopStreamtoWebSocket = (streamId: string): void => {
  if (activeStreams[streamId] && activeStreams[streamId].intervalId) {
    clearInterval(activeStreams[streamId].intervalId);

    // Remove the stream from the activeStreams object
    delete activeStreams[streamId];
  }
};

// module.exports = {
//   stopStream,sendStreamDatatoWebSocket
// }

// Example usage
// Assuming you have a streamId (replace 'yourStreamId' with the actual streamId)
// sendStreamDataToWebSocket('yourStreamId', 'cpu');
// stopStream('yourStreamId');

