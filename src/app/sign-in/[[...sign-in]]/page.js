"use client"; //
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // If the user is already signed in, redirect to buyer dashboard
  if (isSignedIn) {
    router.push("/dashboard/buyer");
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
