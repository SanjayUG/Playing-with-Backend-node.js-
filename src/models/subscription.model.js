
import mongoose, {model, Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: { // one who is subscripting
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel : { // one to whom subscriber is subscripting
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});



export const Subscription = mongoose.model("Subscription", subscriptionSchema);