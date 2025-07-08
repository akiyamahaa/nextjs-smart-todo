"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export function CalendarButton({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 items-center">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(selectedDate), "PPP")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(selectedDate)}
          onSelect={(date) => {
            if (date) {
              const formatted = date.toLocaleDateString("en-CA");
              setSelectedDate(formatted);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
