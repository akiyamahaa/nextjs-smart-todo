"use client";

import { TaskHeader } from "./Components/TaskHeader/TaskHeader";
import Stats from "./Components/Stats/Stats";
import { TasksArea } from "./Components/TasksArea/TasksArea";
import { TasksFooter } from "./Components/TaskFooter/TaskFooter";
import { TasksDialog } from "./Components/Dialogs/TaskDialog/TaskDialog";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarButton } from "./Components/TaskHeader/CalendarButton";
import { Button } from "@/components/ui/button";
import { useTasksStore } from "@/app/stores/useTasksStore";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [viewAll, setViewAll] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div
        className="border w-full max-w-[1200px] border-zinc-200 dark:border-zinc-700 bg-muted/40 backdrop-blur-sm dark:bg-zinc-800/40 shadow-lg rounded-xl p-4 sm:p-6 md:p-8 flex flex-col gap-6
        transition-all duration-300 ease-in-out"
      >
        <div className="w-full bg-white dark:bg-zinc-900 shadow-md rounded-xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          <TaskHeader />
          <Stats />

          <AllTasksHeader
            viewAll={viewAll}
            setViewAll={setViewAll}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <TasksArea selectedDate={viewAll ? null : selectedDate} />
          <TasksFooter />
        </div>
      </div>
    </div>
  );
}

function AllTasksHeader({
  selectedDate,
  setSelectedDate,
  viewAll,
  setViewAll,
}: {
  selectedDate: string;
  setSelectedDate: (val: string) => void;
  viewAll: boolean;
  setViewAll: (val: boolean) => void;
}) {
  const { tasks } = useTasksStore();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
          {viewAll
            ? "📋 All Tasks"
            : `📆 Tasks for ${formatDate(selectedDate)}`}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {viewAll
            ? `${tasks.length} tasks in total`
            : formatDate(selectedDate)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-1 sm:mt-0 flex-wrap">
        {!viewAll && (
          <CalendarButton
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        <Button
          variant="secondary"
          size="sm"
          className="transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? "🔙 View by Date" : "📃 View All"}
        </Button>
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
