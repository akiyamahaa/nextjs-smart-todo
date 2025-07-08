"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTasksStore } from "@/app/stores/useTasksStore";

export function SearchButton() {
  const { setTasks, allTasks } = useTasksStore();
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);

    if (!value) {
      setTasks(allTasks); // ✅ lấy lại full data
      return;
    }

    const filtered = allTasks.filter((task) =>
      task.name.toLowerCase().includes(value.toLowerCase())
    );

    setTasks(filtered);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <IoSearchSharp className="text-[20px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <Input
          id="search"
          placeholder="Search task name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
