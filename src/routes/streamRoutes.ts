import express from 'express';
import {createStream,startStream,stopStream,destroyStream} from '../controllers/streamController'
const router = express.Router();

router.post('/create/:type',createStream);
router.post('/start/:id/:type',startStream);
router.post('/stop/:id/:type',stopStream);
router.post('/destroy/:id/:type',destroyStream);

export default router;