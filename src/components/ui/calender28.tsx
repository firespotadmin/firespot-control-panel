"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// function isValidDate(date: Date | undefined) {
//   if (!date) return false
//   return !isNaN(date.getTime())
// }

export function DatePicker({
  value,
  onChange,
  label,
}: {
  value?: Date
  onChange: (date: Date | undefined) => void
  label?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [displayValue, setDisplayValue] = React.useState(formatDate(value))

  React.useEffect(() => {
    setDisplayValue(formatDate(value))
  }, [value])

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-[14px] text-left font-normal"
            >
              {displayValue || label}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date)
                setDisplayValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
