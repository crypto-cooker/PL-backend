import express from 'express'
const router = express.Router();

import { findByMintAddr, findByWallet, lock, unlock } from "../controllers/stakeController";

// Lock a pNFT
router.post("/lock", lock);

// Unlock a pNFT
router.post("/unlock", unlock);

// Retrieve all locked pNfts in the wallet
router.get("/findByWallet/:wallet", findByWallet);

// Check nft locked info
router.get("/findByMintAddr/:mint", findByMintAddr);

export default router
