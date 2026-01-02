import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

import User from '@/models/User';

export const dynamic = 'force-dynamic';

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
};

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');
        const slug = searchParams.get('slug');
        const search = searchParams.get('search');
        const make = searchParams.get('make');
        const type = searchParams.get('type');
        const listingType = searchParams.get('listingType');
        const year = searchParams.get('year');

        if (slug) {
            // Increment views when fetching a single car
            let car = await Car.findOneAndUpdate(
                { $or: [{ slug }, { _id: mongoose.Types.ObjectId.isValid(slug) ? slug : new mongoose.Types.ObjectId() }] },
                { $inc: { views: 1 } },
                { new: true }
            );

            if (!car) return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 });

            // Get seller name
            const seller = await User.findOne({ clerkId: car.sellerId });
            const carData = car.toObject();
            carData.sellerName = seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'Premium Seller';
            carData.sellerImage = seller?.profileImage || '';

            return NextResponse.json({ success: true, data: carData });
        }

        // Build filter query
        const query = {};
        if (sellerId) query.sellerId = sellerId;
        if (type) query.type = type;
        if (listingType) query.listingType = listingType;
        if (make) query.make = new RegExp(make, 'i');
        if (year) query.year = parseInt(year);

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { make: new RegExp(search, 'i') },
                { model: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        const cars = await Car.find(query).sort({ createdAt: -1 });

        // Enhance with seller names
        const carsWithSellers = await Promise.all(cars.map(async (car) => {
            const seller = await User.findOne({ clerkId: car.sellerId });
            return {
                ...car.toObject(),
                sellerName: seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'Premium Seller',
                sellerImage: seller?.profileImage || ''
            };
        }));

        return NextResponse.json({ success: true, data: carsWithSellers });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { title, description, type, price, images, specs, whatsappNumber, make, model, year, mileage, status, listingType, rentalPrice, location } = body;

        const carImages = images || (body.imageUrl ? [body.imageUrl] : []);

        if (!title || carImages.length === 0 || !whatsappNumber || !make || !model || !year || !mileage || !location) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const car = await Car.create({
            title,
            slug: generateSlug(title),
            description,
            type,
            price,
            images: carImages,
            specs,
            sellerId: userId,
            whatsappNumber,
            make,
            model,
            year,
            mileage,
            status: status || 'active',
            listingType: listingType || 'sale',
            rentalPrice,
            location
        });

        return NextResponse.json({ success: true, data: car }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { _id, title, description, type, price, images, specs, whatsappNumber, make, model, year, mileage, status, listingType, rentalPrice, location } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Missing car ID' }, { status: 400 });
        }

        const carImages = images || (body.imageUrl ? [body.imageUrl] : []);

        const updateData = {
            title, description, type, price, images: carImages, specs, whatsappNumber,
            make, model, year, mileage, status, listingType, rentalPrice, location
        };

        // If the car doesn't have a slug, generate one on update
        const existingCar = await Car.findById(_id);
        if (existingCar && !existingCar.slug && title) {
            updateData.slug = generateSlug(title);
        }

        const car = await Car.findOneAndUpdate(
            { _id: _id, sellerId: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!car) {
            return NextResponse.json({ success: false, error: 'Car not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: car });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        await dbConnect();
        const car = await Car.findOneAndDelete({ _id: id, sellerId: userId });

        if (!car) {
            return NextResponse.json({ success: false, error: 'Car not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
