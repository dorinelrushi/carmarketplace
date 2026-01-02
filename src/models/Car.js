import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the car.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the car.'],
    },
    type: {
        type: String,
        required: [true, 'Please specify the type of car.'],
        enum: ['Sports', 'SUV', 'Electric', 'Sedan', 'Truck', 'Luxury'],
    },
    price: {
        type: String,
    },
    listingType: {
        type: String,
        enum: ['sale', 'rent'],
        default: 'sale',
        required: true,
    },
    rentalPrice: {
        type: String,
    },
    location: {
        type: String,
        required: [true, 'Please provide a location.'],
    },
    images: {
        type: [String], // Array of image URLs/Base64
        required: [true, 'Please provide at least one image.'],
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
        acceleration: String,
        horsepower: String,
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
}, { strict: false, timestamps: true });

// Force model recompilation if it exists to pick up schema changes
if (mongoose.models.Car) {
    delete mongoose.models.Car;
}

export default mongoose.model('Car', CarSchema);
