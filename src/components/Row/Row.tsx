import React from 'react';
import { OutlayRowRequest, RowType } from '../../App.types';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import {
  changeStatus,
  createChild,
  createRow,
  createRowOnDB,
  CreateRowStatus,
  deleteRow,
  deleteRowFromDB,
  setCurrentRow,
  udpateRowOnDB,
  updateRow,
} from '../../Redux/rowListSlice';

import addFileIcon from '../../assets/img/icons/file.svg';
import deleteIcon from '../../assets/img/icons/icons8-trash-can.svg';
import addChildIcon from '../../assets/img/icons/secondLevelFolder.png';

import './Row.style.scss';

const Row: React.FC<{
  row: RowType;
  icon: string;
  status: string;
  rowType: string;
  parentId: number | null;
}> = ({ row, icon, status, rowType, parentId }) => {
  const dispatch = useAppDispatch();
  const rowlist = useAppSelector(state => state.rowListSlice.rowList)

  const [rowNameInput, setRowNameInput] = React.useState<string>(row.rowName);
  const rowNameInputRef = React.useRef<HTMLInputElement>(null);

  const [salaryInput, setSalaryInput] = React.useState<number>(0);
  const salaryInputRef = React.useRef<HTMLInputElement>(null);

  const [equipmentCostsInput, setEquipmentCostsInput] = React.useState<number>(0);
  const equipmentCostsInputRef = React.useRef<HTMLInputElement>(null);

  const [overheadsInput, setOverheadsInput] = React.useState<number>(0);
  const overheadsInputRef = React.useRef<HTMLInputElement>(null);

  const [estimatedProfitInput, setEstimatedProfitInput] = React.useState<number>(0);
  const estimatedProfitInputRef = React.useRef<HTMLInputElement>(null);

  const updatedRow = {
    ...row,
    equipmentCosts: equipmentCostsInput,
    estimatedProfit: estimatedProfitInput,
    machineOperatorSalary: row.machineOperatorSalary,
    mainCosts: row.mainCosts,
    materials: row.materials,
    mimExploitation: row.mimExploitation,
    overheads: overheadsInput,
    rowName: rowNameInput,
    salary: salaryInput,
    supportCosts: row.supportCosts,
  };

  const createNewRow = () => {
    if (rowType === 'row') {
      dispatch(createRow(''));
      dispatch(changeStatus(CreateRowStatus.CREATING));
      dispatch(setCurrentRow(rowlist.length));
    } else {
      dispatch(changeStatus(CreateRowStatus.UPDATING));
    }
  };

  const submitRow = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.code === 'Enter') {
      status === CreateRowStatus.UPDATING
        ? dispatch(udpateRowOnDB({ row: { ...updatedRow }, rowID: row.id }))
        : dispatch(
            createRowOnDB({ row: { ...updatedRow, parentId } as OutlayRowRequest, trueID: row.id }),
          );

      dispatch(changeStatus(CreateRowStatus.WAITING));
    }

    if (event.code === 'Escape') {
      dispatch(changeStatus(CreateRowStatus.WAITING));
    }
  };

  const onDeleteRow = (id: number) => {
    dispatch(deleteRow(id));
    dispatch(deleteRowFromDB(id));
    if (rowType === 'row') dispatch(setCurrentRow(0));
  };

  let currentStatus = status === CreateRowStatus.CREATING || status === CreateRowStatus.UPDATING;

  return (
    <>
      {!currentStatus ? (
        <div className="row" onDoubleClick={() => dispatch(changeStatus(CreateRowStatus.UPDATING))}>
          <div
            className={`row__folder ${
              rowType === 'child'
                ? 'row__folder_child'
                : rowType === 'file'
                ? 'row__folder_file'
                : ''
            }`}>
            <img className="row__main-icon" src={icon} alt="" />
            <div className="row__control-wrapper">
              <img className="row__control-icon" src={icon} alt="" onClick={createNewRow} />
              {rowType === 'row' && (
                <img
                  className="row__control-icon"
                  src={addChildIcon}
                  alt="add child"
                  onClick={() => {
                    dispatch(createChild(row.id));
                    dispatch(changeStatus(CreateRowStatus.CREATING));
                  }}
                />
              )}
              {rowType !== 'file' && (
                <img
                  className="row__control-icon"
                  src={addFileIcon}
                  alt="add document"
                  onClick={() => {
                    dispatch(createChild(row.id));
                    dispatch(changeStatus(CreateRowStatus.CREATING));
                  }}
                />
              )}
              {
                <img
                  className="row__control-icon"
                  src={deleteIcon}
                  alt="delete"
                  onClick={() => onDeleteRow(row.id)}
                />
              }
            </div>
          </div>
          <p className="row__data-cell">{row.rowName}</p>
          <p className="row__data-cell">{row.salary}</p>
          <p className="row__data-cell">{row.equipmentCosts}</p>
          <p className="row__data-cell">{row.overheads}</p>
          <p className="row__data-cell">{row.estimatedProfit}</p>
        </div>
      ) : (
        <div className="row" onKeyDown={submitRow}>
          <div
            className={`row__folder ${
              rowType === 'child'
                ? 'row__folder_child'
                : rowType === 'file'
                ? 'row__folder_file'
                : ''
            }`}>
            <img className="row__main-icon" src={icon} alt="" />
          </div>
          <input
            className="row__input-cell"
            type="text"
            value={rowNameInput}
            onChange={() => setRowNameInput(rowNameInputRef.current?.value as string)}
            ref={rowNameInputRef}
          />
          <input
            className="row__input-cell"
            type="number"
            value={salaryInput}
            onChange={() =>
              setSalaryInput(
                salaryInputRef.current?.value
                  ? +salaryInputRef.current?.value
                  : (null as unknown as number),
              )
            }
            ref={salaryInputRef}
          />
          <input
            className="row__input-cell"
            type="number"
            value={equipmentCostsInput}
            onChange={() =>
              setEquipmentCostsInput(
                equipmentCostsInputRef.current?.value
                  ? +equipmentCostsInputRef.current?.value
                  : (null as unknown as number),
              )
            }
            ref={equipmentCostsInputRef}
          />
          <input
            className="row__input-cell"
            type="number"
            value={overheadsInput}
            onChange={() =>
              setOverheadsInput(
                overheadsInputRef.current?.value
                  ? +overheadsInputRef.current?.value
                  : (null as unknown as number),
              )
            }
            ref={overheadsInputRef}
          />
          <input
            className="row__input-cell"
            type="number"
            value={estimatedProfitInput}
            onChange={() =>
              setEstimatedProfitInput(
                estimatedProfitInputRef.current?.value
                  ? +estimatedProfitInputRef.current?.value
                  : (null as unknown as number),
              )
            }
            ref={estimatedProfitInputRef}
          />
        </div>
      )}
    </>
  );
};

export default Row;
