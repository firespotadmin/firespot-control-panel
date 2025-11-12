"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown2 } from "iconsax-reactjs"
import { File } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePicker } from "@/components/ui/calender28"

const TopContentOne = () => {
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>()
    const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>()
    const [selectedPeriod, setSelectedPeriod] = useState<string>("this-week")

    const handleRadioChange = (value: string) => {
        setSelectedPeriod(value)

        // auto-set dates based on selection
        const today = new Date()
        if (value === "today") {
            setSelectedDateFrom(today)
            setSelectedDateTo(today)
        } else if (value === "this-week") {
            const first = new Date(today)
            first.setDate(today.getDate() - today.getDay())
            const last = new Date(today)
            last.setDate(first.getDate() + 6)
            setSelectedDateFrom(first)
            setSelectedDateTo(last)
        } else if (value === "custom") {
            setSelectedDateFrom(undefined)
            setSelectedDateTo(undefined)
        }
    }

    const clearFilters = () => {
        setSelectedPeriod("this-week")
        handleRadioChange("this-week")
    }

    const ranges = [
        {
            label: "Today",
            from: new Date(),
            to: new Date(),
        },
        {
            label: "This Week",
            from: new Date(),
            to: new Date(),
        },
        {
            label: "This Month",
            from: new Date(),
            to: new Date(),
        },
        {
            label: "This Quater",
            from: new Date(),
            to: new Date(),
        },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                {/* Left side content */}
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-[14px] text-[#00000066] font-medium capitalize">
                            {selectedPeriod.replace("-", " ")}
                        </p>
                        <Popover>
                            <PopoverTrigger className="cursor-pointer">
                                <ArrowDown2 size={12} color="#00000066" className="cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px]">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[17px] font-[700]">Showing</p>
                                    <button
                                        onClick={clearFilters}
                                        className="text-[12px] font-[500] underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>

                                <div className="flex flex-col gap-[12px]">
                                    <p className="text-[14px] text-[#6B7280] font-medium">Filter by time period</p>

                                    <RadioGroup
                                        value={selectedPeriod}
                                        onValueChange={handleRadioChange}
                                        className="space-y-0"
                                    >
                                        {
                                            ranges.map((range,key) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <RadioGroupItem className="text-[#344054]" value={range.label} id={range.label} />
                                                    <Label htmlFor={range.label} className="text-[14px] text-[#344054]">
                                                        {range.label}
                                                    </Label>
                                                </div>

                                            ))
                                        }


                                    </RadioGroup>

                                    <p className="text-[12px] font-[500] text-[#545F6C]">Choose a date range</p>

                                    {/* Show date pickers only when "custom" is selected */}
                                    <div className="flex justify-between gap-[10px]">
                                        <DatePicker
                                            value={new Date(selectedDateFrom + "").toLocaleString() ? selectedDateFrom : undefined}
                                            onChange={setSelectedDateFrom}
                                            label="From"
                                        />
                                        <DatePicker
                                            value={selectedDateTo}
                                            onChange={setSelectedDateTo}
                                            label="To"
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <h1 className="font-bold text-[24px] mt-1">Overview</h1>
                </div>

                {/* Right side button */}
                <Button className="py-[12px] bg-[#E5E7EB] font-medium hover:bg-[#E5E7EB] text-[#000] gap-2 text-[12px] h-[40px] cursor-pointer rounded-full">
                    <File /> DOWNLOAD REPORT
                </Button>
            </div>
        </div>
    )
}

export default TopContentOne
