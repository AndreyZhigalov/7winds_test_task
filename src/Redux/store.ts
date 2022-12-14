import { configureStore } from '@reduxjs/toolkit';
import rowListSlice from './rowListSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    userSlice,
    rowListSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
