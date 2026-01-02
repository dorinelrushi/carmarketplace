import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    try {
        const stats = await Car.aggregate([
            {
                $group: {
                    _id: '$sellerId',
                    totalCars: { $sum: 1 },
                    totalViews: { $sum: { $ifNull: ['$views', 0] } },
                    totalClicks: { $sum: { $ifNull: ['$whatsappClicks', 0] } },
                    cars: { $push: { title: '$title', make: '$make', model: '$model', images: '$images' } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'clerkId',
                    as: 'userDetail'
                }
            },
            {
                $unwind: {
                    path: '$userDetail',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    totalCars: 1,
                    totalViews: 1,
                    totalClicks: 1,
                    cars: 1,
                    sellerName: {
                        $cond: {
                            if: { $and: ['$userDetail.firstName', '$userDetail.lastName'] },
                            then: { $concat: ['$userDetail.firstName', ' ', '$userDetail.lastName'] },
                            else: { $ifNull: ['$userDetail.firstName', 'Premium Seller'] }
                        }
                    },
                    profileImage: { $ifNull: ['$userDetail.profileImage', ''] },
                    joined: { $ifNull: ['$userDetail.createdAt', new Date()] }
                }
            },
            { $sort: { totalClicks: -1, totalViews: -1 } }
        ]);

        return NextResponse.json({ success: true, data: stats });
    } catch (error) {
        console.error("Owners API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
