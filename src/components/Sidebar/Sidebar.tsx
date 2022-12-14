import React from 'react';
import listArrow from '../../assets/img/icons/listArrow.svg';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { changeStatus, createRow, CreateRowStatus, setCurrentRow } from '../../Redux/rowListSlice';

import './Sidebar.style.scss';

function Sidebar() {
  const { rowList, currentRow } = useAppSelector((state) => state.rowListSlice);
  const [isInput, setIsInput] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (inputRef.current && !event.composedPath()?.includes(inputRef.current)) {
        dispatch(changeStatus(CreateRowStatus.WAITING));
      }
    };

    document.addEventListener('click', handleClick);
    return document.removeEventListener('click', handleClick);
  }, []);

  const sumbitRow = () => {
    setIsInput(false);
    setInputValue('');
    dispatch(createRow(inputValue));
    dispatch(changeStatus(CreateRowStatus.CREATING));
    dispatch(setCurrentRow(rowList.length));
  };

  const submitInput = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.code === 'Enter') {
      sumbitRow();
    }
    if (event.code === 'Escape') {
      setIsInput(false);
      setInputValue('');
    }
  };

  return (
    <nav className="sidebar">
      <header className="sidebar__input-wrapper" onClick={() => setIsInput(true)}>
        {isInput ? (
          <input
            className="sidebar__input"
            ref={inputRef}
            type="text"
            placeholder="Введите аббревиатуру"
            onKeyDown={submitInput}
            value={inputValue}
            onChange={() => setInputValue(inputRef.current?.value as string)}
          />
        ) : (
          <div className="sidebar__input-placeholder">
            <h2 className="sidebar__input-placeholder_top">Название проекта</h2>
            <p className="sidebar__input-placeholder_bottom">Аббревиатура</p>
          </div>
        )}
        {inputValue && (
          <img className="sidebar__arrow" src={listArrow} alt="createRow" onClick={sumbitRow} />
        )}
      </header>
      <ul className="sidebar__project-list">
        {rowList?.map((item, index) => (
          <li
            className={`sidebar__project-item ${currentRow === index ? 'current' : ''}`}
            key={item.id}
            onClick={() => {
              dispatch(setCurrentRow(index));
            }}>
            {item.rowName.split(/\s/).length === 1
              ? item.rowName
              : item.rowName
                  .split(/\s/)
                  .map((word) => word.toUpperCase().at(0))
                  .join('')}
          </li>
        )) || <p>У вас нет проектов</p>}
      </ul>
    </nav>
  );
}

export default Sidebar;
