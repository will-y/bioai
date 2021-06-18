import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";


class NavComponent extends React.Component {

    render() {
        return (
            <Link className={"nav-component" + (this.props.active ? " nav-component-active " : " ") + this.props.classes}
                  to={this.props.path} onClick={this.props.clickFn}>
                {this.props.title}
            </Link>
        );
    }
}

export default NavComponent;
