import 'dotenv/config'
import express, { Request, Response } from 'express'
import bodyParser from "body-parser";
import cors from "cors";
// import cron from 'node-cron';
import mongoose from 'mongoose'
import stakeRoutes from './routes/stakeRoutes'

// import { airdropReward } from "./controllers/stakeAirdrop";
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import nonceRoutes from './routes/nonceRoutes';

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pioneer.vercel.app",
  "https://pioneerlegends.vercel.app",
  "https://pioneer-staking-overview.onrender.com",
  "https://pioneer-legends-demo.vercel.app"]

const corsOptions = {
  origin: whitelist,
  credentials: true,
  sameSite: 'none'
}

const app = express();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(async () => {

    console.log("Connected to the database! ❤️")
    // set port, listen for requests
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the database! 😭", err);
    process.exit();
  });

// simple route
app.get("/", (req: Request, res: Response) => {
  res.send("Pioneer backend is running. ❤️");
});

app.use("/user", userRoutes);
app.use("/nonce", nonceRoutes);
app.use("/stake", stakeRoutes);
app.use("/admin", adminRoutes);

// Schedule the task to run every Sunday at 10:00 AM
// cron.schedule('0 10 * * 0', async () => {
//   console.log('Task running at 10:00 AM every Sunday');

//   await airdropReward();
// });
