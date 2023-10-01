import express, { Request, Response, NextFunction } from 'express';

import AppError from '../utils/appError';
import {sendStreamDatatoWebSocket,stopStreamtoWebSocket} from '../utils/webSocket'


// enum for stream types
enum StreamType{
  cpu = 'cpu',
  memory = 'memory'
}

interface StreamInfo{
  //key: string;
  isRunning: boolean;
  streamType: StreamType;
}

const activeStreams: {[Key: string]:StreamInfo}= {};

export const createStream = (req: Request, res: Response, next: NextFunction): void => {
    let {type} = req.params;
    type = type.toLowerCase();
    if(type!='cpu' && type!='memory'){
      return next(new AppError('Please enter the correct stream type', 400));
    }
    // generate a random string
    const streamId = Math.random().toString(36).substring(7);
    // Initialize the stream information
    activeStreams[streamId] = {
    isRunning: false,
    streamType: type as StreamType,
    };
    //console.log(activeStreams[streamId]);
    res.status(200).json({
      streamId: streamId,
      StreamType: type,
      message: "Stream created Successfully"
    })
};

export const startStream = (req: Request, res: Response, next: NextFunction): void => {
  // implementation
  let {id, type} = req.params;
  type = type.toLowerCase();
  if(!activeStreams[id]){
    return next(new AppError("Stream not found!", 400));
  }
  if(activeStreams[id].streamType!=type){
    return next(new AppError("Stream Type is incorrect for this Id", 400));
  }
  if(activeStreams[id].isRunning==true){
    return next(new AppError("This stream is already running!", 400));
  }

  // enable stream
  activeStreams[id].isRunning = true;
  

  sendStreamDatatoWebSocket(id, type);

  res.status(200).send({
   id, type,
   message: "Stream started Successfully"
  })

};

export const stopStream = (req: Request, res: Response, next: NextFunction): void => {
  // Implementation
  let {id, type} = req.params;
  type = type.toLowerCase();
  if(!activeStreams[id]){
    return next(new AppError("Stream not found",400));
  }
  if(activeStreams[id].streamType!=type){
    return next(new AppError("Please check Stream Type", 400));
  }
  if(activeStreams[id].isRunning==false){
    return next(new AppError("This stream already stoppped", 400));
  }
  activeStreams[id].isRunning = false;
  stopStreamtoWebSocket(id);
  res.status(200).json({
    id,type,message: "Stream stopped Successfully"
  })


};

export const destroyStream = (req: Request, res: Response, next:NextFunction): void => {
  // implementation
  let {id, type} = req.params;
  type = type.toLowerCase();
  if(!activeStreams[id]){
    return next(new AppError('Stream not found',400));
  }
  if(activeStreams[id].streamType!==type){
    return next(new AppError('Please check Stream Type', 400));
  }
  // stop the stream if its running
  if(activeStreams[id].isRunning){
    activeStreams[id].isRunning = false;
    stopStreamtoWebSocket(id);
  }
  //remove the stream from the list of active streams
  delete activeStreams[id];
  res.status(200).json({
    id,type,message:'Stream destroyed Successfully',
  })
};
