import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { auth, currentUser } from '@clerk/nextjs/server';

// GET: Fetch current user's profile
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        let user = await User.findOne({ clerkId: userId });

        // If user doesn't exist in DB, create from Clerk data
        if (!user) {
            const clerkUser = await currentUser();
            user = await User.create({
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
            });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// POST: Set user role (buyer or seller) - ONLY ONCE, CANNOT CHANGE
export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { role } = await request.json();

        if (!['buyer', 'seller'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
        }

        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            // New user - create with role
            const clerkUser = await currentUser();
            user = await User.create({
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                role,
            });
        } else {
            // User exists - check if role is already set
            if (user.role) {
                return NextResponse.json({
                    success: false,
                    error: `You are already registered as a ${user.role}. Role cannot be changed.`
                }, { status: 400 });
            }

            // Role not set yet - set it now (first time only)
            user.role = role;
            await user.save();
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}


