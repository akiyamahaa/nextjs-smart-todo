"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";
import { LogoutButton } from "@/LogoutBtn";
import { useUserStore } from "@/app/stores/useUserStore";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function UserProfile() {
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  // Sync switch with current theme
  useEffect(() => {
    setChecked(theme === "dark");
  }, [theme]);

  const toggleDarkMode = (checked: boolean) => {
    setChecked(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full p-0">
          <FaUserCircle className="text-[26px] text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2 rounded-xl shadow-lg"
      >
        {/* User Info */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">
            {user?.email || "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">Signed in</p>
        </div>

        <DropdownMenuSeparator />

        {/* Dark Mode Toggle */}
        <DropdownMenuItem asChild>
          <div className="flex items-center justify-between w-full px-2 py-1.5">
            <Label className="text-sm">Dark Mode</Label>
            <Switch
              checked={checked}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <div className="w-full px-2 py-1.5">
              <LogoutButton />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
