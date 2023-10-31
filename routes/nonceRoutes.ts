import express from 'express';
import { createNonce, checkNonce } from '../controllers/nonceController';
import { verifyNonceMiddleware } from '../middleware/verifyNonce';

const router = express.Router();

router.post('/get-nonce', createNonce);
router.post('/check-nonce', verifyNonceMiddleware, checkNonce);

export default router;
