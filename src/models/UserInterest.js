import mongoose from 'mongoose';

const UserInterestSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    interests: {
        type: Map,
        of: Number,
        default: {}, // Maps category (e.g., 'Hotel') to score
    },
}, { timestamps: true });

export default mongoose.models.UserInterest || mongoose.model('UserInterest', UserInterestSchema);
