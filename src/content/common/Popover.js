import React from "react";
import './Popover.css';
import {disablePopover} from "./PopoverUtilities";

class Popover extends React.Component {

    render() {
        return (
            <div className="popover-container" id={this.props.popoverId}>
                <div className="close-popover" onClick={() => {
                    disablePopover(this.props.popoverId);
                    if (this.props.closeFunction) {
                        this.props.closeFunction();
                    }
                }}>
                    {"Close >"}
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default Popover;
