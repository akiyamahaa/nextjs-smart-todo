"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useRouter } from "next/navigation";

const layout = ({ children }: PropsWithChildren) => {
  const router = useRouter(); // Next.js router for redirection
  const { validateUser } = useUserStore();
  const [loading, setLoading] = useState(true); // ⏳ loading state

  // Validation logic
  useEffect(() => {
    const checkUser = async () => {
      const isAuthenticated = await validateUser();

      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push("/sign-in");
      } else {
        router.push("/");
      }
      setLoading(false); // ✅ stop loading after check
    };

    checkUser(); // Call validation function on component mount
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>{" "}
        {/* You can replace this with a spinner */}
      </div>
    );
  }

  return <div>{children}</div>;
};

export default layout;
