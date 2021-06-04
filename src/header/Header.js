import React from 'react';
import './Header.css';
import Navbar from "./NavBar";


class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <Navbar activePath={this.props.activePath} pages={this.props.pages}/>
            </div>
        );
    }
}

export default Header;
