import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');

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
        const { title, description, type, price, imageUrl, specs, whatsappNumber, make, model, year, mileage, status, listingType, rentalPrice, location } = body;

        // Validate required fields based on listing type
        if (!title || !imageUrl || !whatsappNumber || !make || !model || !year || !mileage || !location) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Validate price based on listing type
        if (listingType === 'rent' && !rentalPrice) {
            return NextResponse.json({ success: false, error: 'Rental price is required for rent listings' }, { status: 400 });
        }
        if (listingType === 'sale' && !price) {
            return NextResponse.json({ success: false, error: 'Sale price is required for sale listings' }, { status: 400 });
        }

        const car = await Car.create({
            title,
            description,
            type,
            price,
            imageUrl,
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
        const { _id, title, description, type, price, imageUrl, specs, whatsappNumber, make, model, year, mileage, status, listingType, rentalPrice, location } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Missing car ID' }, { status: 400 });
        }

        const car = await Car.findOneAndUpdate(
            { _id: _id, sellerId: userId }, // Ensure only the owner can edit
            { title, description, type, price, imageUrl, specs, whatsappNumber, make, model, year, mileage, status, listingType, rentalPrice, location },
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
        const car = await Car.findOneAndDelete({ _id: id, sellerId: userId }); // Ensure only owner can delete

        if (!car) {
            return NextResponse.json({ success: false, error: 'Car not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
