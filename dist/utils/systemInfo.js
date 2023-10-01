"use strict";
// // utils.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHostName = exports.fetchMemoryUsage = exports.fetchCpuUsage = void 0;
// import { exec } from 'child_process';
// // Function to execute a command and return the result
// export const executeCommand = (command: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(stdout.trim());
//       }
//     });
//   });
// };
// let HOST_NAME: string;
// // Function to fetch the host name of the system
// export const fetchHostName = async (): Promise<string> => {
//   try {
//     const result = await executeCommand('wmic computersystem get name');
//     const sunny = result.split('\n');
//     const hostname = sunny[1];
//     HOST_NAME = hostname;
//     return hostname; 
//   } catch (error) {
//     throw new Error(`Error fetching host name: ${error}`);
//   }
// };
// // Function to fetch CPU usage from the system using wmic
// export const fetchCpuUsage = async (): Promise<number> => {
//   try {
//     const result = await executeCommand(`wmic cpu get loadpercentage  /value`);
//     const cpuUsage = parseInt(result, 10);
//     return isNaN(cpuUsage) ? 0 : cpuUsage;
//   } catch (error) {
//     throw new Error(`Error fetching CPU usage: ${error}`);
//   }
// };
// // Function to fetch Memory (RAM) usage from the system using wmic
// export const fetchMemoryUsage = async (): Promise<number> => {
//   try {
//     const result = await executeCommand(`wmic /node:${HOST_NAME} OS get FreePhysicalMemory`);
//     const memoryUsage = parseInt(result, 10);
//     return isNaN(memoryUsage) ? 0 : memoryUsage;
//   } catch (error) {
//     throw new Error(`Error fetching Memory usage: ${error}`);
//   }
// };
// const getData = async()=>{
//   const cpuUsage = await fetchCpuUsage();
//    //const memoryUsage = await fetchMemoryUsage();
//    const name = await fetchHostName();
//   console.log(`CPU Usage: ${cpuUsage}%`);
//  // console.log(`Memory Usage: ${memoryUsage} MB`);
//   console.log(name)
// }
// getData();
const os = __importStar(require("os"));
// Function to fetch CPU usage from the system
const fetchCpuUsage = () => {
    const cpus = os.cpus();
    const totalCpuUsage = cpus.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle, 0);
    const avgCpuUsage = (totalCpuUsage / cpus.length) / (totalCpuUsage + cpus[0].times.idle);
    return avgCpuUsage * 100;
};
exports.fetchCpuUsage = fetchCpuUsage;
// Function to fetch Memory (RAM) usage from the system in GB
const fetchMemoryUsage = () => {
    const totalMemoryGB = os.totalmem() / (Math.pow(1024, 3)); // Convert bytes to gigabytes
    const freeMemoryGB = os.freemem() / (Math.pow(1024, 3));
    const usedMemoryGB = totalMemoryGB - freeMemoryGB;
    return usedMemoryGB;
};
exports.fetchMemoryUsage = fetchMemoryUsage;
// Function to fetch the host name of the system
const fetchHostName = () => {
    return os.hostname();
};
exports.fetchHostName = fetchHostName;
// //Fetch and display system information
// const displaySystemInfo = () => {
//   const hostName = fetchHostName();
//   const cpuUsage = fetchCpuUsage();
//   const memoryUsage = fetchMemoryUsage();
//   //console.log(`Host Name: ${hostName}`);
//   //console.log(`CPU Usage: ${cpuUsage.toFixed(2)}%`);
//   //console.log(`Memory Usage: ${memoryUsage.toFixed(2)} GB`);
// };
// // Display system information
// displaySystemInfo();
