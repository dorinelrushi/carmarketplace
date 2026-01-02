import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

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

        if (slug) {
            // Try slug first, then ID if it's a valid ObjectId
            let car = await Car.findOne({ slug });

            if (!car && mongoose.Types.ObjectId.isValid(slug)) {
                car = await Car.findById(slug);
            }

            if (!car) return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 });
            return NextResponse.json({ success: true, data: car });
        }

        const query = sellerId ? { sellerId } : {};
        const cars = await Car.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: cars });
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
