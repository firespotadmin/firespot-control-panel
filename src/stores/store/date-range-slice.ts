// store/slices/dateRangeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DateRangeState {
  fromDate: string;
  toDate: string;
}

function getThisWeekRange(): { from: string; to: string } {
  const today = new Date();
  const first = new Date(today);
  first.setDate(today.getDate() - today.getDay());
  const last = new Date(first);
  last.setDate(first.getDate() + 6);
  return {
    from: first.toISOString().split("T")[0],
    to: last.toISOString().split("T")[0],
  };
}

const defaultRange = getThisWeekRange();
const initialState: DateRangeState = {
  fromDate: defaultRange.from,
  toDate: defaultRange.to,
};

export const dateRangeSlice = createSlice({
  name: "dateRange",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRangeState>) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
    },
  },
});

export const { setDateRange } = dateRangeSlice.actions;
export default dateRangeSlice.reducer;
