"use client";
import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import RoleSelector from '../components/RoleSelector';
import { Loader2 } from 'lucide-react';

export default function SelectRolePage() {
    const { user, isLoaded } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            if (!isLoaded) return;

            // If not signed in, redirect to home
            if (!isSignedIn) {
                router.push('/');
                return;
            }

            // Check if user already has a role
            try {
                const res = await fetch('/api/user');
                const data = await res.json();

                if (data.success && data.data?.role) {
                    // User already has a role, redirect to their dashboard
                    const dashboardUrl = data.data.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
                    router.push(dashboardUrl);
                } else {
                    // User needs to select a role
                    setChecking(false);
                }
            } catch (error) {
                console.error('Failed to check user role:', error);
                setChecking(false);
            }
        };

        checkUserRole();
    }, [isLoaded, isSignedIn, router]);

    const handleRoleSelected = (role) => {
        // Redirect to appropriate dashboard after role selection
        const dashboardUrl = role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
        router.push(dashboardUrl);
    };

    if (!isLoaded || checking) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <RoleSelector onRoleSelected={handleRoleSelected} />
        </div>
    );
}
