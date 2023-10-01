"use strict";
// // import * as WebSocket from 'ws';
// import wss from '../app'
// import {fetchCpuUsage, fetchMemoryUsage} from "../utils/systemInfo"
// import { Server } from 'http'; // Import Server from 'http'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopStreamtoWebSocket = exports.sendStreamDatatoWebSocket = void 0;
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
const WebSocket = __importStar(require("ws"));
const app_1 = __importDefault(require("../app"));
const systemInfo_1 = require("../utils/systemInfo");
const activeStreams = {};
const sendStreamDatatoWebSocket = (streamId, type) => {
    const interval = setInterval(() => {
        // if (wss.clients.size === 0) {
        //   clearInterval(interval);
        //   return;
        // }
        let systemInfo;
        let dataToSend;
        if (type === 'cpu') {
            systemInfo = (0, systemInfo_1.fetchCpuUsage)();
            const CPU_Usage = systemInfo + ' %';
            dataToSend = JSON.stringify({
                streamId,
                CPU_Usage,
                timestamp: new Date(),
            });
        }
        else {
            systemInfo = (0, systemInfo_1.fetchMemoryUsage)();
            const Memory_Usage = systemInfo + ' MB';
            dataToSend = JSON.stringify({
                streamId,
                Memory_Usage,
                timestamp: new Date(),
            });
        }
        app_1.default.clients.forEach((client) => {
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
exports.sendStreamDatatoWebSocket = sendStreamDatatoWebSocket;
const stopStreamtoWebSocket = (streamId) => {
    if (activeStreams[streamId] && activeStreams[streamId].intervalId) {
        clearInterval(activeStreams[streamId].intervalId);
        // Remove the stream from the activeStreams object
        delete activeStreams[streamId];
    }
};
exports.stopStreamtoWebSocket = stopStreamtoWebSocket;
// module.exports = {
//   stopStream,sendStreamDatatoWebSocket
// }
// Example usage
// Assuming you have a streamId (replace 'yourStreamId' with the actual streamId)
// sendStreamDataToWebSocket('yourStreamId', 'cpu');
// stopStream('yourStreamId');
