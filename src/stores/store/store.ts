import { configureStore } from "@reduxjs/toolkit";
import statsReducer from "@/stores/store/stats-slice";
import dateRangeReducer from "@/stores/store/date-range-slice";

export const store = configureStore({
  reducer: {
    stats: statsReducer,
     dateRange: dateRangeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
