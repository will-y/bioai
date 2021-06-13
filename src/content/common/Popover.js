import React from "react";
import './Popover.css';

class Popover extends React.Component {
    render() {
        return (
            <div className="popover-container" id={this.props.popoverId}>
                {this.props.children}
            </div>
        );
    }
}

export default Popover;
