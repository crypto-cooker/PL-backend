import express from 'express';
import { getProfile, setProfile } from '../controllers/userController';
import { authorizeUser } from '../controllers/nonceController';
import { verifyNonceMiddleware } from '../middleware/verifyNonce';

const router = express.Router();

router.post('/authorize', authorizeUser);
router.get('/profile/:wallet', getProfile);
router.post('/setprofile', setProfile);

export default router;
