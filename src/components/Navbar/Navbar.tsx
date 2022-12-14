import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import appsIcon from '../../assets/img/icons/apps.svg';
import returnArrow from '../../assets/img/icons/returnArrow.svg';

import './Navbar.style.scss';

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className='navbar__item'>
          <Link to={'apps'}>
            <img className='navbar__icon' src={appsIcon} alt="apps" />
          </Link>
        </li>
        <li className='navbar__item'>
          <Link to={'../'}>
            <img className='navbar__icon' src={returnArrow} alt="return" />
          </Link>
        </li>
        <li className='navbar__item'>
          <Link to={'view'} className={pathname === '/view' ? 'active' : ''}>
            Просмотр
          </Link>
        </li>
        <li className='navbar__item'>
          <Link to={'settings'} className={pathname === '/settings' ? 'active' : ''}>
            Управление
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
