"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamController_1 = require("../controllers/streamController");
const router = express_1.default.Router();
router.post('/create/:type', streamController_1.createStream);
router.post('/start/:id/:type', streamController_1.startStream);
router.post('/stop/:id/:type', streamController_1.stopStream);
router.post('/destroy/:id/:type', streamController_1.destroyStream);
exports.default = router;
