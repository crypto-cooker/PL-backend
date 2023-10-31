import { default as mongoose, Schema } from 'mongoose'

const StakeSchema = new Schema({
  user: {
    required: true,
    type: String
  },
  mintAddr: {
    required: true,
    type: String
  },
  startTime: {
    required: true,
    type: Date
  },
  uri: {
    required: true,
    type: String
  },
  imgUrl: {
    required: true,
    type: String
  },
  faction: {
    required: true,
    type: String
  },
});

export default mongoose.model("stakedata", StakeSchema);

