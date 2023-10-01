import express, { Request, Response, NextFunction } from 'express';
import {fetchCpuUsage, fetchMemoryUsage} from "../utils/systemInfo"
import AppError from '../utils/appError';

interface StreamInfo{
  //key: string;
  isRunning: boolean;
}

const activeStreams: {[Key: string]:StreamInfo}= {};

export const createStream = (req: Request, res: Response, next: NextFunction): void => {
    let {type} = req.params;
    type = type.toLocaleLowerCase();
    if(type!='cpu' && type!='memory'){
      return next(new AppError('Please enter the correct stream type', 400));
    }
    // generate a random string
    const streamId = Math.random().toString(36).substring(7);
    // Initialize the stream information
    activeStreams[streamId] = {
    isRunning: false,
    };
    //console.log(activeStreams[streamId]);
    res.status(200).json({
      streamId: streamId,
      message: "Stream created SuccessfullyQ"
    })
};

export const startStream = (req: Request, res: Response): void => {
  // implementation
};

export const stopStream = (req: Request, res: Response): void => {
  // implementation
};

export const destroyStream = (req: Request, res: Response): void => {
  // implementation
};
