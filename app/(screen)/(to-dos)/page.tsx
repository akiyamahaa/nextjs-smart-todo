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
    <div className="min-h-screen bg-background flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 shadow-md rounded-xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
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
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg sm:text-xl font-semibold">
          {viewAll ? "All Tasks" : `Tasks for ${formatDate(selectedDate)}`}
        </h2>
        <p className="text-sm text-muted-foreground">
          {viewAll ? `${tasks.length} tasks total` : formatDate(selectedDate)}
        </p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {!viewAll && (
          <CalendarButton
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? "View by Date" : "View All Tasks"}
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
