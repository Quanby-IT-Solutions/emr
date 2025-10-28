"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ✅ Define props interface
interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(value);

  // Keep local state in sync with the parent
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  // Handle date selection
  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        // Keep the same time as the current date
        newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      }
      setDate(newDate);
      onChange(newDate);
    } else {
      setDate(null);
      onChange(null);
    }
    setOpen(false);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    const [hours, minutes, seconds = "0"] = e.target.value.split(":");
    const newDate = new Date(date);
    newDate.setHours(Number(hours), Number(minutes), Number(seconds));
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={
            date
              ? date
                  .toLocaleTimeString("en-GB", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
              : "00:00:00"
          }
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
