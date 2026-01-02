import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
    sellerId: {
        type: String,
        required: true,
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Restaurant', 'Hotel', 'Car Dealer', 'Real Estate', 'Other'],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    contactType: {
        type: String,
        enum: ['whatsapp', 'call', 'reservation'],
        default: 'whatsapp',
    },
    reservationLink: {
        type: String,
    },
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
    },
    price: {
        type: Number,
        required: true,
    },
    durationWeeks: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'pending'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
