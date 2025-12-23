import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the car.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the car.'],
    },
    type: {
        type: String,
        required: [true, 'Please specify the type of car.'],
        enum: ['Sports', 'SUV', 'Electric', 'Sedan', 'Truck'],
    },
    price: {
        type: String, // Keeping as string for formatting flexibility (e.g. "$145,000")
    },
    listingType: {
        type: String,
        enum: ['sale', 'rent'],
        default: 'sale',
        required: true,
    },
    rentalPrice: {
        type: String, // e.g. "$500/day"
    },
    location: {
        type: String,
        required: [true, 'Please provide a location.'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL.'],
    },
    sellerId: {
        type: String,
        required: [true, 'Every car must belong to a seller.'],
    },
    whatsappNumber: {
        type: String,
        required: [true, 'Please provide a WhatsApp number.'],
        trim: true,
    },
    specs: {
        engine: String,
        transmission: String,
        topSpeed: String,
        acceleration: String, // e.g. "0-60: 2.8s"
        horsepower: String,   // e.g. "750 HP"
    },
    make: {
        type: String,
        required: [true, 'Please provide the make.'],
    },
    model: {
        type: String,
        required: [true, 'Please provide the model.'],
    },
    year: {
        type: Number,
        required: [true, 'Please provide the year.'],
    },
    mileage: {
        type: Number,
        required: [true, 'Please provide the mileage.'],
    },
    status: {
        type: String,
        enum: ['active', 'reserved', 'sold'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { strict: false });

// Force model recompilation if it exists to pick up schema changes
if (mongoose.models.Car) {
    delete mongoose.models.Car;
}

export default mongoose.model('Car', CarSchema);
