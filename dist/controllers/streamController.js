"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyStream = exports.stopStream = exports.startStream = exports.createStream = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const webSocket_1 = require("../utils/webSocket");
// enum for stream types
var StreamType;
(function (StreamType) {
    StreamType["cpu"] = "cpu";
    StreamType["memory"] = "memory";
})(StreamType || (StreamType = {}));
const activeStreams = {};
const createStream = (req, res, next) => {
    let { type } = req.params;
    type = type.toLowerCase();
    if (type != 'cpu' && type != 'memory') {
        return next(new appError_1.default('Please enter the correct stream type', 400));
    }
    // generate a random string
    const streamId = Math.random().toString(36).substring(7);
    // Initialize the stream information
    activeStreams[streamId] = {
        isRunning: false,
        streamType: type,
    };
    //console.log(activeStreams[streamId]);
    res.status(200).json({
        streamId: streamId,
        StreamType: type,
        message: "Stream created Successfully"
    });
};
exports.createStream = createStream;
const startStream = (req, res, next) => {
    // implementation
    let { id, type } = req.params;
    type = type.toLowerCase();
    if (!activeStreams[id]) {
        return next(new appError_1.default("Stream not found!", 400));
    }
    if (activeStreams[id].streamType != type) {
        return next(new appError_1.default("Stream Type is incorrect for this Id", 400));
    }
    if (activeStreams[id].isRunning == true) {
        return next(new appError_1.default("This stream is already running!", 400));
    }
    // enable stream
    activeStreams[id].isRunning = true;
    (0, webSocket_1.sendStreamDatatoWebSocket)(id, type);
    res.status(200).send({
        id, type,
        message: "Stream started Successfully"
    });
};
exports.startStream = startStream;
const stopStream = (req, res, next) => {
    // Implementation
    let { id, type } = req.params;
    type = type.toLowerCase();
    if (!activeStreams[id]) {
        return next(new appError_1.default("Stream not found", 400));
    }
    if (activeStreams[id].streamType != type) {
        return next(new appError_1.default("Please check Stream Type", 400));
    }
    if (activeStreams[id].isRunning == false) {
        return next(new appError_1.default("This stream already stoppped", 400));
    }
    activeStreams[id].isRunning = false;
    (0, webSocket_1.stopStreamtoWebSocket)(id);
    res.status(200).json({
        id, type, message: "Stream stopped Successfully"
    });
};
exports.stopStream = stopStream;
const destroyStream = (req, res, next) => {
    // implementation
    let { id, type } = req.params;
    type = type.toLowerCase();
    if (!activeStreams[id]) {
        return next(new appError_1.default('Stream not found', 400));
    }
    if (activeStreams[id].streamType !== type) {
        return next(new appError_1.default('Please check Stream Type', 400));
    }
    // stop the stream if its running
    if (activeStreams[id].isRunning) {
        activeStreams[id].isRunning = false;
        (0, webSocket_1.stopStreamtoWebSocket)(id);
    }
    //remove the stream from the list of active streams
    delete activeStreams[id];
    res.status(200).json({
        id, type, message: 'Stream destroyed Successfully',
    });
};
exports.destroyStream = destroyStream;
