import React from 'react';
import './Header.scss';
import { Button } from '@material-ui/core';

const Header = (props) => {
    return (
        <div id="header">
            <h1>Discover New Cocktails</h1>
            <Button variant="contained" onClick={props.handleClick} color="primary">Random Drink</Button>
            <hr/>    
        </div>
    );
};

export default Header;