import {
    Transaction,
    PublicKey,
} from '@solana/web3.js';

import { ADMIN_WALLET, connection } from './config';

const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

//  Add admin sign and confirm transaction
export const addAdminSignAndConfirm = async (tx: Transaction) => {

    // Sign the transaction with admin's Keypair
    tx = await ADMIN_WALLET.signTransaction(tx);

    const sTx = tx.serialize();

    // Send the raw transaction
    const options = {
        commitment: 'confirmed',
        skipPreflight: false,
    };
    // Confirm the transaction
    const signature = await connection.sendRawTransaction(sTx, options);
    const confirmed = await connection.confirmTransaction(signature, "confirmed");

    console.log("Transaction confirmed:", signature);
    return confirmed;
}

//  Get NFT metadata account
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        PublicKey.findProgramAddressSync([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
}
