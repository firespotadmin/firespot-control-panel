// store/slices/dateRangeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DateRangeState {
  fromDate: string;
  toDate: string;
}

const initialState: DateRangeState = {
  fromDate: "",
  toDate: "",
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
