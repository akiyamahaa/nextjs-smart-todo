import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComboboxDemo } from "./PriorityCombobox";
import { TasksOptions } from "./TasksOptions";
import { useTasksStore } from "@/app/stores/useTasksStore";
import { Task } from "@/app/data/Tasks";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import CircularProgress from "@mui/material/CircularProgress";
import { FaUmbrellaBeach } from "react-icons/fa6";
import { useUserStore } from "@/app/stores/useUserStore";
import { format } from "date-fns";

export function TasksArea({ selectedDate }: { selectedDate: string | null }) {
  const { tasks, fetchTasks } = useTasksStore();
  const { user } = useUserStore();

  useEffect(() => {
    getTasksData(user);
  }, [user]);

  async function getTasksData(user: { id: string; email: string } | null) {
    await fetchTasks(user);
  }

  const filteredTasks = selectedDate
    ? tasks.filter((task) => task.taskDate === selectedDate)
    : tasks;

  return (
    <ScrollArea className="h-60 flex flex-col gap-4">
      {filteredTasks.length === 0 ? (
        <div className="  h-full w-full flex items-center justify-center  flex-col gap-6">
          <FaUmbrellaBeach className="text-[79px] text-slate-500 opacity-85" />
          <span className="text-sm text-slate-400 opacity-85 text-center">
            It looks like there are no tasks available. <br /> Click above to
            add a new task
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((singleTask) => (
            <SingleTask key={singleTask.id} singleTask={singleTask} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

export function SingleTask({ singleTask }: { singleTask: Task }) {
  const { updateTaskFunction, setTaskSelected, setIsTaskDialogOpened } =
    useTasksStore();
  const [loading, setLoading] = useState(false);

  async function handleCheckboxChange() {
    setLoading(true);
    const updateTaskObject: Task = {
      ...singleTask,
      status: singleTask.status === "completed" ? "in progress" : "completed",
    };
    const result = await updateTaskFunction(updateTaskObject);
    setLoading(false);
    if (!result.success) toast({ title: "error" });
  }

  const isCompleted = singleTask.status === "completed";

  return (
    <div
      className={`w-full rounded-lg px-4 py-3 border flex items-center justify-between 
      transition-all duration-200 bg-white dark:bg-zinc-800 hover:shadow-sm 
      ${isCompleted ? "opacity-60" : ""}`}
    >
      {/* Left: Checkbox + Title */}
      <div className="flex items-start gap-3 w-full max-w-[70%]">
        {loading ? (
          <CircularProgress size={18} />
        ) : (
          <Checkbox
            id={`task-${singleTask.id}`}
            className="mt-1"
            checked={isCompleted}
            onCheckedChange={handleCheckboxChange}
          />
        )}

        <div className="flex flex-col gap-0.5 w-full">
          <button
            onClick={() => {
              setTaskSelected(singleTask);
              setIsTaskDialogOpened(true);
            }}
            className={`text-left text-base font-medium hover:text-primary transition-all truncate ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {singleTask.name}
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              className={`capitalize px-2 py-0.5 text-[10px] ${
                singleTask.priority === "high"
                  ? "bg-red-100 text-red-600"
                  : singleTask.priority === "medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600"
              }`}
              variant="outline"
            >
              {singleTask.priority}
            </Badge>
            <span className="hidden sm:inline">
              {format(new Date(singleTask.taskDate), "PPP")}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <ComboboxDemo singleTask={singleTask} />
        <TasksOptions singleTask={singleTask} />
      </div>
    </div>
  );
}
