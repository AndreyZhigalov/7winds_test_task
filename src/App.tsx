import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './Redux/hooks';
import { FetchUser, setUserData } from './Redux/userSlice';

import Navbar from './components/Navbar/Navbar';
import Apps from './pages/Apps';
import Managing from './pages/Managing';
import View from './pages/View';
import { setRowList } from './Redux/rowListSlice';

function App() {
  const dispatch = useAppDispatch();
  const { status, userData } = useAppSelector((state) => state.userSlice);

  React.useEffect(() => {
    dispatch(setUserData());
  }, []);

  React.useEffect(() => {
    if (status === FetchUser.SUCCESS) {
      dispatch(setRowList(userData.id));
    }
  }, [status]);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path={''} element={<View />} />
        <Route path={'view'} element={<View />} />
        <Route path={'settings'} element={<Managing />} />
        <Route path={'apps'} element={<Apps />} />
        <Route
          path={'*'}
          element={<span className="empty-page__placeholder">Страница не найдена</span>}
        />
      </Routes>
    </div>
  );
}

export default App;
