import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Try to find user by clerkId
        let user = await User.findOne({ clerkId: userId });
        const clerkUser = await currentUser();

        if (user && clerkUser) {
            // Update existing record with the latest Clerk info
            let changed = false;
            if (!user.profileImage || user.profileImage !== clerkUser.imageUrl) {
                user.profileImage = clerkUser.imageUrl;
                changed = true;
            }
            if (!user.firstName || user.firstName !== clerkUser.firstName) {
                user.firstName = clerkUser.firstName;
                changed = true;
            }
            if (!user.lastName || user.lastName !== clerkUser.lastName) {
                user.lastName = clerkUser.lastName;
                changed = true;
            }
            if (changed) await user.save();
        }

        if (!user) {
            // 2. If not found, get Clerk details to try finding by email
            if (!clerkUser) {
                return NextResponse.json({ success: false, error: 'User data not found in Clerk' }, { status: 404 });
            }

            const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

            if (userEmail) {
                // 3. Try to find user by email (in case Clerk ID changed/re-registered)
                user = await User.findOne({ email: userEmail });

                if (user) {
                    // Update existing record with the new Clerk ID
                    user.clerkId = userId;
                    // Also update names if they've changed
                    user.firstName = clerkUser.firstName || user.firstName;
                    user.lastName = clerkUser.lastName || user.lastName;
                    user.profileImage = clerkUser.imageUrl || user.profileImage;
                    await user.save();
                    console.log("API: Synced existing email account to new Clerk ID");
                } else {
                    // 4. Truly a new user
                    user = await User.create({
                        clerkId: userId,
                        email: userEmail,
                        firstName: clerkUser.firstName || '',
                        lastName: clerkUser.lastName || '',
                        profileImage: clerkUser.imageUrl || '',
                    });
                    console.log("API: Created brand new user account");
                }
            } else {
                return NextResponse.json({ success: false, error: 'User email not found' }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("API Error [GET /api/user]:", error);
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
        const { role } = await request.json();

        if (!['buyer', 'seller'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
        }

        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            const clerkUser = await currentUser();
            if (!clerkUser) {
                return NextResponse.json({ success: false, error: 'User data not found in Clerk' }, { status: 404 });
            }

            const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

            // Check by email first to prevent duplicate key errors
            user = await User.findOne({ email: userEmail });

            if (user) {
                user.clerkId = userId;
                user.role = role;
                user.profileImage = clerkUser.imageUrl || user.profileImage;
                await user.save();
            } else {
                user = await User.create({
                    clerkId: userId,
                    email: userEmail || '',
                    firstName: clerkUser.firstName || '',
                    lastName: clerkUser.lastName || '',
                    profileImage: clerkUser.imageUrl || '',
                    role,
                });
            }
        } else {
            // Already exists, just update role if not set
            if (!user.role) {
                user.role = role;
                await user.save();
            } else if (user.role !== role) {
                // Return 200 but keep old role or handle error
                return NextResponse.json({
                    success: false,
                    error: `Already a ${user.role}`
                }, { status: 200 });
            }
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("API Error [POST /api/user]:", error);
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
        const { firstName, lastName, profileImage } = await request.json();

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { firstName, lastName, profileImage },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("API Error [PUT /api/user]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
