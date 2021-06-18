import React from "react";
import "./Popover.css";
import {togglePopover} from "./PopoverUtilities";

class PopoverToggle extends React.Component {

    render() {
        return (
            <button onClick={() => togglePopover(this.props.toToggle)} className={this.props.buttonClass}>
                {this.props.text}
            </button>
        );
    }
}

export default PopoverToggle;
