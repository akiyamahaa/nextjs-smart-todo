"use client";

import { TaskHeader } from "./Components/TaskHeader/TaskHeader";
import Stats from "./Components/Stats/Stats";
import { TasksArea } from "./Components/TasksArea/TasksArea";
import { TasksFooter } from "./Components/TaskFooter/TaskFooter";
import { TasksDialog } from "./Components/Dialogs/TaskDialog/TaskDialog";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarButton } from "./Components/TaskHeader/CalendarButton";
//
//
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  return (
    <div className="min-h-screen border flex items-center w-full justify-center poppins  ">
      <div
        className="w-[55%]   border border-gray-400 flex flex-col gap-6 bg-inherit shadow-md 
      rounded-md p-8"
      >
        <TaskHeader />
        <Stats />
        <AllTasksHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TasksArea selectedDate={selectedDate} />
        <TasksFooter />
      </div>
    </div>
  );
}

function AllTasksHeader({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: (val: string) => void;
}) {
  return (
    <div className="flex justify-between items-center mt-4 mb-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">
          Tasks for {formatDate(selectedDate)}
        </h2>
        <p className="text-sm text-gray-400">{formatDate(selectedDate)}</p>
      </div>

      <div className="flex items-center gap-2">
        <CalendarButton
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TasksDialog />
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
}
