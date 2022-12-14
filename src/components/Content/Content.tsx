import { ChildType } from '../../App.types';
import firstLevelIcon from '../../assets/img/icons/firstLevelFolder.svg';
import secondLevelIcon from '../../assets/img/icons/secondLevelFolder.png';
import fileLevelIcon from '../../assets/img/icons/file.svg';
import { useAppSelector } from '../../Redux/hooks';

import Row from '../Row/Row';

import './Content.style.scss';

function Content() {
  const { rowList, status, currentRow } = useAppSelector((state) => state.rowListSlice);
  let row = rowList?.[currentRow];

  return (
    <section className="content">
      <ul className="content__project-tabs">
        <li key={7} className="content__tab-name">
          {row?.rowName}
        </li>
      </ul>
      <article className="content__wrapper">
        <ul className="content__project-categories">
          <li key={1} className="content__category">
            Уровень
          </li>
          <li key={2} className="content__category">
            Наименование работ
          </li>
          <li key={3} className="content__category">
            Основная з/п
          </li>
          <li key={4} className="content__category">
            Оборудование
          </li>
          <li key={5} className="content__category">
            Накладные расходы
          </li>
          <li key={6} className="content__category">
            Сметная прибыль
          </li>
        </ul>
        <ul className="content__container">
          {!!rowList?.length && !!row && (
            <>
              {!!row.id && (
                <li className="content__row-wrapper">
                  <Row
                    key={row.id}
                    row={row}
                    parentId={null}
                    icon={firstLevelIcon}
                    status={status}
                    rowType={'row'}
                  />           
                </li>
              )}

              {row?.child &&
                row.child.map((child: ChildType) => (
                  <>
                    {!!child.id && (
                      <li className="content__row-wrapper">
                        <Row
                          key={child.id}
                          row={child}
                          parentId={row.id}
                          icon={secondLevelIcon}
                          status={status}
                          rowType={'child'}
                        />                       
                      </li>
                    )}
                    {child.child &&
                      child.child.map((file: ChildType) => (
                        <>
                          {!!file.id && (
                            <li className="content__row-wrapper">
                              <Row
                                key={file.id}
                                row={file}
                                parentId={child.id}
                                icon={fileLevelIcon}
                                status={status}
                                rowType={'file'}
                              />
                            </li>
                          )}
                        </>
                      ))}
                  </>
                ))}
            </>
          )}
        </ul>
      </article>
    </section>
  );
}

export default Content;
