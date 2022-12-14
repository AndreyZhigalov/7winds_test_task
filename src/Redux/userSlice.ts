import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { EntityResponse } from '../App.types';

export enum FetchUser {
  PENDING = 'Fetching data from a server...',
  SUCCESS = 'User data has been recieved',
  ERROR = 'User data fetching was failed',
  WAITING = 'I am waiting for fetching user data',
}

const initialState = {
  userData: {
    id: 0,
    rowName: '',
  } as EntityResponse,
  status: FetchUser.WAITING,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUserData.pending, (state, action) => {
      state.status = FetchUser.PENDING;
    });
    builder.addCase(setUserData.fulfilled, (state, action) => {
      state.status = FetchUser.SUCCESS;
      action.payload
        ? (state.userData = { id: action.payload.id, rowName: action.payload.rowName })
        : (state.userData = state.userData);
    });
    builder.addCase(setUserData.rejected, (state, action) => {
      state.status = FetchUser.ERROR;
      alert('Не удалось загрузить данные пользователя');
    });
  },
});

export const setUserData = createAsyncThunk('setUserDataStatus', async () => {
  if (localStorage.getItem('ID')) {
    const id = Number(localStorage.getItem('ID'));
    const rowName = localStorage.getItem('rowName') as string;
    return { id, rowName } as EntityResponse;
  } else {
    axios
      .post<EntityResponse>('http://185.244.172.108:8081/v1/outlay-rows/entity/create')
      .then(({ data }) => {
        localStorage.setItem('ID', JSON.stringify(data.id));
        localStorage.setItem('rowName', JSON.stringify(data.rowName));
        return data as EntityResponse;
      });
  }
});

export const {} = userSlice.actions;
export default userSlice.reducer;
