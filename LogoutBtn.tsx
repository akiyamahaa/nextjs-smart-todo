"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "./app/stores/useUserStore";
import { IoMdLogOut } from "react-icons/io";

export function LogoutButton() {
  const router = useRouter();
  const { handleLogout, isLoading } = useUserStore();

  // Combine handleLogout with navigation logic
  const handleLogoutWithRedirect = async () => {
    await handleLogout(); // Call the store's logout function
    router.push("/sign-in"); // Redirect to the home page after logging out
  };

  return (
    <button
      onClick={handleLogoutWithRedirect}
      disabled={isLoading}
      className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-md transition-colors cursor-pointer text-sm font-medium text-primary"
    >
      <IoMdLogOut className="text-lg" />
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
