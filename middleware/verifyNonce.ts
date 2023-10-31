import NonceModel from '../models/nonceModel'
import { NextFunction, Request, Response } from "express";

export const verifyNonceMiddleware = async function (req: Request, res: Response, next: NextFunction) {
    const { body } = req

    if ((!body.wallet || !body.nonce))
        return res.status(400).json({ error: "Wallet and nonce must be strings" })

    if (body.nonce.length != 16)
        return res.status(400).json({ error: "Invalid nonce length" })

    // Find nonce
    let foundNonce = null;

    try {
        foundNonce = await NonceModel.findOne({ wallet: body.wallet, nonce: body.nonce, authorized: true }).exec()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }

    if (foundNonce === null) return res.status(400).json({ error: "Invalid nonce" })

    return next()
}
