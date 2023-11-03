import { Request, Response } from 'express';
import nacl from 'tweetnacl';
import Joi from 'joi';
import bs58 from 'bs58';

import UserModel from '../models/userModel'

//  Get user name, pfp from wallet address
export const getProfile = async function (req: Request, res: Response) {

    const wallet = req.params.wallet;

    const userData = await UserModel.findOne({
        wallet
    });

    if (userData == null)
        return res.status(404).json({ message: "No user registered" });

    return res.status(200).json({
        message: "Fetched user data.",
        name: userData.name,
        img: userData.img
    });
}

//  Set user name, pfp
export const setProfile = async function (req: Request, res: Response) {

    const { body } = req;

    // Validate form
    const UserSchema = Joi.object().keys({
        name: Joi.string().required(),
        wallet: Joi.string().required(),
        img: Joi.string().allow(''),
        signature: Joi.string().required()
    });

    const inputValidation = UserSchema.validate(body);
    console.log(inputValidation);
    if (!!inputValidation.error) return res.status(400).json({ error: inputValidation.error.details[0].message })

    //  update user profile
    const userData = {
        name: body.name,
        wallet: body.wallet,
        img: body.img
    };

    await UserModel.findOneAndUpdate(
        { wallet: body.wallet },
        userData,
        { upsert: true });

    return res.status(200).json({ message: "profile saved." });
}

export const getNonce = (): number => {
    return Math.floor(new Date().getTime() / 3600000);
}
