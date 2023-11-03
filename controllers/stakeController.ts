import { Request, Response } from 'express'
import fetch from "cross-fetch"
import { addAdminSignAndConfirm } from "../program/script";

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { getMetadata } from "../program/script";
import {
  Transaction,
} from '@solana/web3.js';
import { CREATOR, STAKE_TX_DISC, UNSTAKE_TX_DISC, connection } from "../program/config";

import StakeModel from '../models/stakeModel'
// import fetch from 'node-fetch';

// Lock a pNFT
export async function lock(req: Request, res: Response) {
  const { encodedTx, user } = req.body;

  if (!encodedTx || !user)
    return res.status(400).json({ error: "Invalid Request" });

  const tx = Transaction.from(Buffer.from(encodedTx, 'base64'));

  //  user address
  const payer = tx.feePayer?.toBase58();
  if (user !== payer)
    return res.status(500).json({ error: "Wallet address error" });

  //  Get Box info
  const stakeIx = tx.instructions.find((ix) => {
    return ix.data.slice(0, 8).equals(Buffer.from(STAKE_TX_DISC));
  });

  if (stakeIx == undefined) {
    // no such instruction found
    return res.status(500).json({ error: "Can not get stake instruction in transaction" });
  }

  const mintAddr = stakeIx.keys[3].pubkey;
  console.log(mintAddr, "lock");
  const doc = await StakeModel.find({ mintAddr });
  if(doc.length>0) {
    return res.status(400).json({ error: "Mint Address already exists" });
  }

  const pda = await getMetadata(mintAddr);

  try {
    let metadata = await Metadata.fromAccountAddress(connection, pda);

    if (metadata.data.creators[0].address != CREATOR || metadata.data.creators[0].verified != true) {
      console.log("Invalid creator: ", metadata.data.creators[0].address, ", verified: ", metadata.data.creators[0].verified);
      return res.status(500).json({error: "Not the right collection"});
    }

    const confirmed = await addAdminSignAndConfirm(tx);

    if (!confirmed || confirmed.value.err)
      throw("Transaction not confirmed");

    const uri = metadata.data.uri.replace(/\0/g, '');
    //  Get data
    const response = await fetch(uri, { method: 'GET' });
    const responsedata: any = await response.json();

    console.log("------------- saving lock nft info to db");
    console.log("user: ", user);
    console.log("mintAddr: ", mintAddr.toBase58());
    console.log("uri: ", uri);
    console.log("imgUrl: ", responsedata.image);
    console.log("faction: ", responsedata.attributes[0].value);

    const stakeData = new StakeModel({
      user,
      mintAddr,
      startTime: new Date(),
      uri,
      imgUrl: responsedata.image,
      faction: responsedata.attributes[0].value,
    });

    await stakeData.save();
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Some error occurred while staking NFT.",
    });
  }

  res.status(200).send({
    message: "NFT staked successfully"
  });
}

// Unlock a pNFT
export async function unlock(req: Request, res: Response) {
  const { encodedTx, user } = req.body;
  if (!encodedTx || !user)
    return res.status(400).json({ error: "Invalid Request" });

  const tx = Transaction.from(Buffer.from(encodedTx, 'base64'));

  //  user address
  const payer = tx.feePayer?.toBase58();
  if (user !== payer)
    return res.status(500).json({ error: "Wallet address error" });

  //  Get Box info
  const unstakeIx = tx.instructions.find((ix) => {
    return ix.data.slice(0, 8).equals(Buffer.from(UNSTAKE_TX_DISC));
  });

  if (unstakeIx == undefined) {
    // no such instruction found
    return res.status(500).json({ error: "Can not get unstake instruction in transaction" });
  }

  const mintAddr = unstakeIx.keys[3].pubkey;

  try {
    await addAdminSignAndConfirm(tx);

    let deleteRes = await StakeModel.deleteOne({ mintAddr }).exec() as any;
    if (deleteRes.deletedCount != 1) {
      return res.status(200).send({
        message: "NFT unstaked but has issue with DB. Plz contact to the admin."
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Some error occurred while unstaking NFT.",
    });
  }

  res.status(200).send({
    message: "NFT unstaked successfully"
  });
}

// Retrieve all nfts staked by the wallet
export async function findByWallet(req: Request, res: Response) {
  try {
    const { wallet } = req.params;
    const data = await StakeModel.find({
      user: wallet
    }).sort({ stakedTime: "desc" });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving stake data.",
    });
  }
}

// Retrieve staked data for the nft
export async function findByMintAddr(req: Request, res: Response) {
  try {
    const mintAddr = req.params.id;
    const data = await StakeModel.findOne({ mintAddr });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving stake data.",
    });
  }
}
