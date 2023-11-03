import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
    PublicKey,
} from "@solana/web3.js";
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

import { IDL } from "./idl";

export const PROGRAM_ID = new PublicKey("PLSeoaC7uLWpkbFjUMvF2Er4RXQThdA6T7S9ZY6BqiT");

export const NFT_SYMBOL = 'CRAB';
export const CREATOR = new PublicKey('26WJyhNttQCts4TWRhAeHR51GhtqgVmrMHqWpmHBXmbm');

export const STAKE_TX_DISC: number[] = [0xe7, 0x62, 0xa2, 0xcf, 0x73, 0x55, 0xdc, 0xd1];
export const UNSTAKE_TX_DISC: number[] = [0xea, 0x5f, 0x96, 0xa4, 0x56, 0xe8, 0x41, 0xc0];

export const ADMIN_KEYPAIR = anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.ADMIN_SECRET_KEY || ''));
export const ADMIN_WALLET = new NodeWallet(ADMIN_KEYPAIR);
export const ADMIN_ADDR = ADMIN_KEYPAIR.publicKey;

// const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');
export const connection = new anchor.web3.Connection(
    "https://light-morning-sea.solana-mainnet.quiknode.pro/519dc0806495a53ab8c9de64fb90c3418b6a1d15/",
    "confirmed");

export const provider = new anchor.AnchorProvider(connection, ADMIN_WALLET, anchor.AnchorProvider.defaultOptions());

export const program = new anchor.Program(
    IDL as anchor.Idl,
    PROGRAM_ID,
    provider
);
