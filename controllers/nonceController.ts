import { Request, Response } from 'express';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import Joi from 'joi';
import crypto from 'crypto'

import NonceModel from '../models/nonceModel'

//  Create and return a new nonce
export const createNonce = async (req: Request, res: Response) => {
    const { body } = req

    // Validate form
    const NonceSchema = Joi.object().keys({
        wallet: Joi.string().required()
    })
    const inputValidation = NonceSchema.validate(body)
    if (!!inputValidation.error) return res.status(400).json(inputValidation.error)

    // if (body.wallet != process.env.ADMIN_PUBLIC_KEY) {
    //     return res.status(400).json("Invalid wallet.");
    // }

    // If nonce is there, remove it
    try {
        await NonceModel.deleteOne({ wallet: body.wallet }).exec()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }

    const nonce = crypto.randomBytes(8).toString('hex')

    const nonceObject = new NonceModel({
        wallet: body.wallet,
        nonce
    })

    try {
        await nonceObject.save()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }

    res.status(200).json({ nonce })
}

//  Check nonce is authorized
export const checkNonce = async (req: Request, res: Response) => {
    const { body } = req;

    res.status(200).json({ message: "Nonce checked" });
}

//  Authorize admin 
export const authorizeAdmin = async (req: Request, res: Response) => {
    const { body } = req

    // Validate form
    const UserSchema = Joi.object().keys({
        wallet: Joi.string().required(),
        signature: Joi.string().required(),
        nonce: Joi.string().required()
    })
    const inputValidation = UserSchema.validate(body)
    if (!!inputValidation.error)
        return res.status(400).json({ error: inputValidation.error.details[0].message })

    if (body.wallet != process.env.ADMIN_PUBLIC_KEY)
        return res.status(400).json({ error: "Admin wallet address mismatch." });

    const foundNonce = await NonceModel.findOne({ wallet: body.wallet }).exec();
    if (!foundNonce)
        return res.status(400).json({ error: "Can not find nonce." })

    const signatureUint8 = bs58.decode(body.signature);
    const msgUint8 = new TextEncoder().encode(`${process.env.SIGN_IN_MSG} ${foundNonce.nonce}`);
    const pubKeyUint8 = bs58.decode(body.wallet);

    try {
        const isValidSignature = nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);

        if (!isValidSignature)
            return res.status(400).json({ error: "Invalid signature" })
    } catch (e) {
        console.log("Error while verifying signature.\n", e);
        return res.status(400).json({ error: "Verifying error" });
    }

    const ret = await foundNonce.updateOne({ authorized: true });

    if (ret.modifiedCount != 1)
        return res.status(400).json({ error: "Can not authorize wallet." });

    res.status(200).json({ message: "Successfully authorized admin wallet." });
}

//  Authorize user
export const authorizeUser = async (req: Request, res: Response) => {
    const { body } = req

    // Validate form
    const UserSchema = Joi.object().keys({
        wallet: Joi.string().required(),
        signature: Joi.string().required(),
        nonce: Joi.string().required()
    })
    const inputValidation = UserSchema.validate(body)
    if (!!inputValidation.error)
        return res.status(400).json({ error: inputValidation.error.details[0].message })

    const foundNonce = await NonceModel.findOne({ wallet: body.wallet }).exec();
    if (!foundNonce)
        return res.status(400).json({ error: "Can not find nonce." })

    const signatureUint8 = bs58.decode(body.signature);
    const msgUint8 = new TextEncoder().encode(`${process.env.SIGN_IN_MSG} ${foundNonce.nonce}`);
    const pubKeyUint8 = bs58.decode(body.wallet);

    try {
        const isValidSignature = nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);

        if (!isValidSignature)
            return res.status(400).json({ error: "Invalid signature" })
    } catch (e) {
        console.log("Error while verifying signature.\n", e);
        return res.status(400).json({ error: "Verifying error" });
    }

    const ret = await foundNonce.updateOne({ authorized: true });

    if (ret.modifiedCount != 1)
        return res.status(400).json({ error: "Can not authorize wallet." });

    res.status(200).json({ message: "Successfully authorized user wallet." });
}
