import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

export async function POST(request) {
    await dbConnect();
    try {
        const { carId, action } = await request.json();

        if (!carId || action !== 'whatsapp_click') {
            return NextResponse.json({ success: false, error: 'Invalid tracking data' }, { status: 400 });
        }

        const car = await Car.findByIdAndUpdate(
            carId,
            { $inc: { whatsappClicks: 1 } },
            { new: true }
        );

        if (!car) {
            return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { whatsappClicks: car.whatsappClicks } });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
