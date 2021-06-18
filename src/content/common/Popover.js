import React from "react";
import './Popover.css';
import {disablePopover} from "./PopoverUtilities";

class Popover extends React.Component {

    render() {
        return (
            <div className="popover-container" id={this.props.popoverId}>
                <div className="close-popover" onClick={() => disablePopover(this.props.popoverId)}>{"Close >"}</div>
                {this.props.children}
            </div>
        );
    }
}

export default Popover;
