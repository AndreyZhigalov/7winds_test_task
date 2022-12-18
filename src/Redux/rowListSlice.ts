import {
  RecalculatedRows,
  RowResponse,
  OutlayRowRequest,
  OutlayRowUpdateRequest,
} from './../App.types';
import { RootState } from './store';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TreeResponse, ChildType, RowType } from '../App.types';

export enum CreateRowStatus {
  CREATING = 'New row is creating',
  WAITING = "I'm waiting for a new row",
  UPDATING = 'Some row is updating now',
}

const initialState = {
  rowList: [] as RowType[],
  status: CreateRowStatus.WAITING,
  currentRow: 0,
};

let rowTemplate: RowType | ChildType = {
  child: [],
  equipmentCosts: 0,
  estimatedProfit: 0,
  id: 0,
  machineOperatorSalary: 0,
  mainCosts: 0,
  materials: 0,
  mimExploitation: 0,
  overheads: 0,
  rowName: '',
  salary: 0,
  supportCosts: 0,
  total: 0,
};

function deletRowListItem(row: RowType, deleteID: number): RowType {
  if (row.child?.length === 0) {
    if (row.id !== deleteID) {
      return row;
    } else {
      return {} as unknown as RowType;
    }
  } else {
    if (row.id !== deleteID) {
      return {
        ...row,
        child: row.child
          ?.map((child: ChildType) => deletRowListItem(child, deleteID))
          .filter((child) => Object.keys(child).length !== 0),
      } as RowType;
    } else {
      return {} as unknown as RowType;
    }
  }
}

function addRowListItem(row: RowType, parendID: number): RowType {
  let tempID = Math.round(Math.random() * 1e16);
  if (row.id === parendID) {
    return { ...row, child: [...row.child, { ...rowTemplate, id: tempID }] };
  } else {
    return { ...row, child: row.child.map((child) => addRowListItem(child, parendID)) };
  }
}

function updateRowListItem(row: RowType, newData: RowType, rowID: number): RowType {
  if (row.id === rowID) {
    return { ...newData, child: [...row.child] };
  } else {
    return { ...row, child: row.child.map((child) => updateRowListItem(child, newData, rowID)) };
  }
}

const rowListSlice = createSlice({
  name: 'rowList',
  initialState,
  reducers: {
    createRow(state, action: PayloadAction<string>) {
      let tempID = Math.round(Math.random() * 1e16);
      state.rowList = !!state.rowList
        ? [...state.rowList, { ...rowTemplate, id: tempID, rowName: action.payload }]
        : [{ ...rowTemplate, id: tempID, rowName: action.payload }];
    },
    createChild(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.rowList = state.rowList.map((row) => addRowListItem(row, id));
    },
    updateRow(state, action: PayloadAction<{ newData: RowType; id: number }>) {
      let newData = action.payload.newData;
      let id = action.payload.id;
      let newRowList = state.rowList.map((row) => updateRowListItem(row, newData as RowType, id));
      localStorage.setItem('rowsList', JSON.stringify(newRowList));
      state.rowList = newRowList;
    },
    deleteRow(state, action: PayloadAction<number>) {
      let newRowList = state.rowList
        .map((row) => deletRowListItem(row, action.payload))
        .filter((row) => Object.keys(row).length !== 0);

      localStorage.setItem('rowsList', JSON.stringify(newRowList));
      state.rowList = newRowList;
    },
    setCurrentRow(state, action) {
      state.currentRow = action.payload;
    },
    changeStatus(state, action: PayloadAction<CreateRowStatus>) {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(setRowList.pending, (state, action) => {});
    builder.addCase(setRowList.fulfilled, (state, action) => {
      state.rowList = JSON.parse(localStorage.getItem('rowsList') as string);
    });
    builder.addCase(setRowList.rejected, (state, action) => {
      alert('Ошибка загрузки базы данных');
    });
    builder.addCase(createRowOnDB.rejected, (state, action) => {
      alert('Ошибка отправки данных');
    });
  },
});

export const setRowList = createAsyncThunk<void, number>('setRowListStatus', async (id, Thunk) => {
  axios
    .get<TreeResponse>(`http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/list`,  )
    .then(({ data }) => {
      localStorage.setItem('rowsList', JSON.stringify(data));
    });
});

export const createRowOnDB = createAsyncThunk<void, { row: OutlayRowRequest; trueID: number }>(
  'createRowOnDBStatus',
  async ({ row, trueID }, Thunk) => {
    const {
      userSlice: {
        userData: { id },
      },
    } = Thunk.getState() as RootState;

    const { data } = await axios.post<RecalculatedRows>(
      `http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/create`,
      row,
       
    );
    Thunk.dispatch(updateRow({ newData: { ...data.current, child: [] } as RowType, id: trueID }));
  },
);

export const udpateRowOnDB = createAsyncThunk<void, { row: OutlayRowUpdateRequest; rowID: number }>(
  'updateRowOnDBStatus',
  async ({ row, rowID }, Thunk) => {
    const {
      userSlice: {
        userData: { id },
      },
    } = Thunk.getState() as RootState;
    const {
      data: { current },
    } = await axios.post(
      `http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/${rowID}/update`,
      row,
       
    );
    Thunk.dispatch(updateRow({ newData: current as RowType, id: rowID }));
  },
);

export const deleteRowFromDB = createAsyncThunk<void, number>(
  'deleteRowFromDBStatus',
  async (rowID, Thunk) => {
    const {
      userSlice: {
        userData: { id },
      },
    } = Thunk.getState() as RootState;
    axios.delete(`http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/${rowID}/delete`,  );
  },
);

export const { deleteRow, setCurrentRow, createRow, createChild, updateRow, changeStatus } =
  rowListSlice.actions;
export default rowListSlice.reducer;
