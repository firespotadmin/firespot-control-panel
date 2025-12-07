"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown2 } from "iconsax-reactjs";
import { File, Download } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/calender28";
import { setDateRange } from "@/stores/store/date-range-slice";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const TopContentOne = () => {
  const dispatch = useDispatch();

  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>();
  const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this-week");
  const [reportDateFrom, setReportDateFrom] = useState<Date | undefined>();
  const [reportDateTo, setReportDateTo] = useState<Date | undefined>();
  const [reportFormat, setReportFormat] = useState<string>("pdf");

  const handleRadioChange = (value: string) => {
    setSelectedPeriod(value);

    const today = new Date();

    if (value === "today") {
      setSelectedDateFrom(today);
      setSelectedDateTo(today);
      dispatch(
        setDateRange({
          fromDate: today.toISOString(),
          toDate: today.toISOString(),
        })
      );
    } else if (value === "this-week") {
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay()); // Sunday
      const last = new Date(first);
      last.setDate(first.getDate() + 6); // Saturday

      setSelectedDateFrom(first);
      setSelectedDateTo(last);
      dispatch(
        setDateRange({
          fromDate: first.toISOString(),
          toDate: last.toISOString(),
        })
      );
    } else if (value === "this-month") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setSelectedDateFrom(first);
      setSelectedDateTo(last);
      dispatch(
        setDateRange({
          fromDate: first.toISOString(),
          toDate: last.toISOString(),
        })
      );
    } else if (value === "this-quarter") {
      const currentMonth = today.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const first = new Date(today.getFullYear(), quarterStartMonth, 1);
      const last = new Date(today.getFullYear(), quarterStartMonth + 3, 0);

      setSelectedDateFrom(first);
      setSelectedDateTo(last);
      dispatch(
        setDateRange({
          fromDate: first.toISOString(),
          toDate: last.toISOString(),
        })
      );
    } else if (value === "custom") {
      setSelectedDateFrom(undefined);
      setSelectedDateTo(undefined);
    }
  };

  // 🔥 Dispatch when both custom dates are selected
  useEffect(() => {
    if (selectedPeriod === "custom" && selectedDateFrom && selectedDateTo) {
      dispatch(
        setDateRange({
          fromDate: selectedDateFrom.toISOString(),
          toDate: selectedDateTo.toISOString(),
        })
      );
    }
  }, [selectedDateFrom, selectedDateTo, selectedPeriod, dispatch]);

  const clearFilters = () => {
    setSelectedPeriod("this-week");
    handleRadioChange("this-week");
  };

  const handleDownloadReport = () => {
    if (reportDateFrom && reportDateTo) {
      console.log(
        `Downloading ${reportFormat.toUpperCase()} report from ${reportDateFrom.toLocaleDateString()} to ${reportDateTo.toLocaleDateString()}`
      );
      // TODO: Add your API call here to download the report
    }
  };

  const ranges = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Quarter", value: "this-quarter" },
    { label: "Custom", value: "custom" },
  ];

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
                <ArrowDown2
                  size={12}
                  color="#00000066"
                  className="cursor-pointer"
                />
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
                  <p className="text-[14px] text-[#6B7280] font-medium">
                    Filter by time period
                  </p>

                  <RadioGroup
                    value={selectedPeriod}
                    onValueChange={handleRadioChange}
                    className="space-y-0"
                  >
                    {ranges.map((range, key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem
                          className="text-[#344054]"
                          value={range.value}
                          id={range.value}
                        />
                        <Label
                          htmlFor={range.value}
                          className="text-[14px] text-[#344054]"
                        >
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <p className="text-[12px] font-[500] text-[#545F6C]">
                    Choose a date range
                  </p>

                  <div className="flex justify-between gap-[10px]">
                    <DatePicker
                      value={selectedDateFrom}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="py-[12px] bg-[#E5E7EB] font-medium hover:bg-[#E5E7EB] text-[#000] gap-2 text-[12px] h-[40px] cursor-pointer rounded-full">
              <File /> DOWNLOAD REPORT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0">
            <DialogHeader>
              <div className="flex justify-center border-b p-[10px]">
                <DialogTitle className="text-[16px]">Download Report</DialogTitle>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4 px-5">
              {/* Date Range Selection */}
              <div className="grid gap-3">
                <Label className="text-[12px] font-[500]">
                  Select Date Range
                </Label>
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <DatePicker
                      value={reportDateFrom}
                      onChange={setReportDateFrom}
                      label="From"
                    />
                  </div>
                  <div className="flex-1">
                    <DatePicker
                      value={reportDateTo}
                      onChange={setReportDateTo}
                      label="To"
                    />
                  </div>
                </div>
              </div>

              {/* Report Format Selection */}
              <div className="grid gap-3">
                <Label className="text-[12px] font-[500]">Format Type</Label>
                <RadioGroup
                  value={reportFormat}
                  onValueChange={setReportFormat}
                  className="flex gap-3"
                >
                  <div className="flex-1">
                    <Label
                      htmlFor="pdf-format"
                      className={`flex items-center space-x-2 border-1 w-full py-3 px-4 rounded-lg cursor-pointer transition-all ${
                        reportFormat === "pdf"
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem
                        value="pdf"
                        id="pdf-format"
                        className="text-black"
                      />
                      <span className="text-[14px] font-[500]">.pdf</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="csv-format"
                      className={`flex items-center space-x-2 border-1 w-full py-3 px-4 rounded-lg cursor-pointer transition-all ${
                        reportFormat === "csv"
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem
                        value="csv"
                        id="csv-format"
                        className="text-black"
                      />
                      <span className="text-[14px] font-[500]">.csv</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <hr className="mx-5" />  

            <div className="flex justify-between p-5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setReportDateFrom(undefined);
                  setReportDateTo(undefined);
                  setReportFormat("pdf");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDownloadReport}
                disabled={!reportDateFrom || !reportDateTo}
                className="bg-[#000] hover:bg-[#000] rounded-full text-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TopContentOne;
