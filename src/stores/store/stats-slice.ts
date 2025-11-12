import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StatsResponse } from "@/types/stats";

const initialState: StatsResponse = {
  data: null!,
  message: null!,
  status: null!,
  success: false,
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    getStats: (state) => state,
    
    updateStats: (state, action: PayloadAction<StatsResponse>) => {
      // ✅ Correct way: mutate fields directly or return the new object
      return { ...state, ...action.payload };
    },
  },
});

export const { getStats, updateStats } = statsSlice.actions;
export default statsSlice.reducer;
