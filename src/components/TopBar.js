import React from 'react';
import '../css/topbar.scss';
import logo from '../images/logo.png';

const TopBar = () => {
    return (
        <div className='topbar'>
            <img src={logo} alt='Logo'/>
        </div>
    )
};

export default TopBar;
