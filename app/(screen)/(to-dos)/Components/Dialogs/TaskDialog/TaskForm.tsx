import { useTasksStore } from "@/app/stores/useTasksStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldErrors,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { BiSolidError } from "react-icons/bi";
import { FaCircle } from "react-icons/fa6";

export function TaskForm() {
  const { setValue, trigger } = useFormContext();
  const { taskSelected, isTaskDialogOpened } = useTasksStore();

  useEffect(() => {
    if (isTaskDialogOpened && taskSelected) {
      setValue("taskName", taskSelected.name);
      setValue("priority", taskSelected.priority);
      setValue("status", taskSelected.status);
      setValue("taskDate", taskSelected.taskDate); // ✅ cần dòng này
      trigger(); // Optional: validate lại nếu có yêu cầu
    }
  }, [isTaskDialogOpened, taskSelected, setValue, trigger]);

  return (
    <div className="flex flex-col gap-6 mt-8">
      <TaskName />
      <div className="grid grid-cols-2 gap-6">
        <TaskPriority />
        <TaskStatus />
      </div>
      <TaskDate /> {/* 🆕 Thêm mới ở đây */}
    </div>
  );
}

export function TaskDate() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false); // ✅ State điều khiển Popover

  return (
    <div className="flex flex-col gap-1">
      <Label className="mb-1">Task Date</Label>
      <Controller
        name="taskDate"
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const formatted = date.toLocaleDateString("en-CA"); // ✅ Chuẩn YYYY-MM-DD, đúng giờ địa phương
                    field.onChange(formatted);
                    setOpen(false); // ✅ Tự động đóng Popover sau khi chọn
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors["taskDate"] && <ShowError label="taskDate" errors={errors} />}
    </div>
  );
}

function TaskName() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <Label htmlFor="taskName">Task Name</Label>
      <Input
        {...register("taskName")}
        id="taskName"
        type="text"
        placeholder="Enter a name of the task"
        className="mt-1"
      />

      {errors["taskName"] && <ShowError label="taskName" errors={errors} />}
    </div>
  );
}

function TaskPriority() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const selectedPriority = watch("priority") || "low";

  // Handle onValueChange and trigger validation
  const handlePriorityChange = (value: string) => {
    setValue("priority", value); // Update the value
    trigger("priority"); // Trigger validation for "priority"
  };

  return (
    <div>
      <Label className="mb-1">Priority</Label>

      <Select value={selectedPriority} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select a priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="low" className="">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-green-600" />
                <span>Low</span>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-yellow-600" />
                <span>Medium</span>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-1 ">
                <FaCircle className="text-[12px] text-red-600" />
                <span>High</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors["priority"] && <ShowError label="priority" errors={errors} />}
    </div>
  );
}

function TaskStatus() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { isTaskDialogOpened, taskSelected } = useTasksStore();

  const selectedStatus = watch("status") || "in progress";
  console.log(selectedStatus);
  // Set "in progress" status when the task dialog is opened
  useEffect(() => {
    if (isTaskDialogOpened && !taskSelected) {
      setValue("status", "in progress");
      trigger("status"); // Validate the form if necessary
    }
  }, [isTaskDialogOpened, trigger]); // Dependencies ensure it runs when the dialog opens

  function handleStatusChange(value: string) {
    console.log(value);
    setValue("status", value);
    trigger("status"); // Validate status field on change
  }

  return (
    <div>
      <Label className="mb-1">Select Status</Label>
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors["status"] && <ShowError label="status" errors={errors} />}
    </div>
  );
}

function ShowError({
  label,
  errors,
}: {
  errors: FieldErrors<FieldValues>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 text-red-500 mt-2">
      <BiSolidError className="text-sm" />
      <p className="text-red-500 text-sm">
        <>{errors[label]?.message}</>
      </p>
    </div>
  );
}
