
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { pt } from 'date-fns/locale'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: DateRange | undefined
  onChange?: (value: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  // Atualiza o estado interno quando as props mudam
  React.useEffect(() => {
    setDate(value)
  }, [value])

  // Atualiza as props quando o estado interno muda
  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange?.(range)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={pt}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
