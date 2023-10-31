import { default as mongoose, Schema } from 'mongoose'

const AirdropSchema = new Schema({
    date: {
        required: true,
        type: Date
    },
    userCnt: {
        required: true,
        type: Number
    },
    amount: {
        required: true,
        type: Number
    },
    type: {
        require: true,
        type: String
    }
});

export default mongoose.model("airdropdatas", AirdropSchema);

