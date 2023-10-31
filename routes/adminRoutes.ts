import express from 'express';
import { airdropReward, getAirdropInfo, getStakeInfo } from '../controllers/adminController';
import { authorizeAdmin } from '../controllers/nonceController';
import { verifyNonceMiddleware } from '../middleware/verifyNonce';

const router = express.Router();

router.post('/authorize', authorizeAdmin);
router.post('/stakeInfo', verifyNonceMiddleware, getStakeInfo);
router.post('/airdropInfo', verifyNonceMiddleware, getAirdropInfo);
router.post('/airdrop', verifyNonceMiddleware, airdropReward);

export default router;
