import { default as mongoose, Schema } from 'mongoose'

const UserSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    wallet: {
        required: true,
        type: String
    },
    img: {
        required: false,
        type: String
    }
});

export default mongoose.model("userdatas", UserSchema);

