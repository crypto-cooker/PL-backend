import { Request, Response } from 'express';
import Joi from 'joi';

import StakeModel from '../models/stakeModel'
import AirdropModel from '../models/airdropModel'
import { ADMIN_ADDR } from '../program/config';

export const getStakeInfo = async (req: Request, res: Response) => {
    const { body } = req;

    // Validate form
    const RequestSchema = Joi.object().keys({
        wallet: Joi.string().required(),
        nonce: Joi.string().required()
    });

    const inputValidation = RequestSchema.validate(body);
    if (!!inputValidation.error) return res.status(400).json({ error: inputValidation.error.details[0].message });

    //  Check admin wallet address
    if (body.wallet != process.env.ADMIN_PUBLIC_KEY) {
        console.log("Invalid admin wallet, wallet: ", body.wallet);
        return res.status(500).json({
            error: "Invalid admin"
        });
    }

    //  Get stake info from db
    try {
        const stakeData = await StakeModel.find();

        return res.status(200).json({
            message: "Success fetching all stake info.",
            stakeData
        });
    } catch (err) {
        console.error("Error while getting stake info.\n", err);
        res.status(500).send({
            error: "Some error occurred while getting stake info.",
        });
    }
}

export const getAirdropInfo = async (req: Request, res: Response) => {
    const { body } = req;

    // Validate form
    const RequestSchema = Joi.object().keys({
        wallet: Joi.string().required(),
        nonce: Joi.string().required()
    });

    const inputValidation = RequestSchema.validate(body);
    if (!!inputValidation.error) return res.status(400).json({ error: inputValidation.error.details[0].message });

    //  Check admin wallet address
    if (body.wallet != process.env.ADMIN_PUBLIC_KEY) {
        console.log("Invalid admin wallet, wallet: ", body.wallet);
        return res.status(200).json({
            message: "Invalid admin"
        });
    }

    //  Get stake info from db
    try {
        const airdropData = await AirdropModel.find();

        return res.status(200).json({
            message: "Success fetching all airdrop info.",
            airdropData
        });
    } catch (err) {
        console.error("Error while getting airdrop info.\n", err);
        res.status(500).send({
            message: "Some error occurred while getting airdrop info.",
        });
    }
}

// Airdrop rewards
export const airdropReward = async (req: Request, res: Response) => {
    const { body } = req;

    // Validate form
    const RequestSchema = Joi.object().keys({
        wallet: Joi.string().required(),
        nonce: Joi.string().required(),
        users: Joi.number().required(),
        amount: Joi.number().required(),
        type: Joi.string().required()
    });

    const inputValidation = RequestSchema.validate(body);
    if (!!inputValidation.error) return res.status(400).json({ error: inputValidation.error.details[0].message });

    const airdropData = new AirdropModel({
        date: new Date(),
        userCnt: body.users,
        amount: body.amount,
        type: body.type
    });

    await airdropData.save();

    return res.status(200).json({
        message: "Saved airdrop data to DB"
    });
}
