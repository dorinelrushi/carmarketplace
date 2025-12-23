"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard/buyer");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignIn />
      <p className="mt-4 text-gray-400">
        Don't have an account?{" "}
        <a href="/sign-up" className="text-red-600 underline">
          Register here
        </a>
      </p>
    </div>
  );
}
