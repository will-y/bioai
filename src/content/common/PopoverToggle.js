import React from "react";
import "./Popover.css";

class PopoverToggle extends React.Component {
    constructor(props) {
        super(props);
        this.togglePopover = this.togglePopover.bind(this);
    }

    togglePopover() {
        const vis = document.getElementById(this.props.toToggle).style.visibility;

        document.getElementById(this.props.toToggle).style.visibility = ((vis === "hidden" || vis === "") ? "visible" : "hidden");
    }


    render() {
        return (
            <button onClick={this.togglePopover} className={this.props.buttonClass}>
                Toggle Popover {this.props.toToggle}
            </button>
        );
    }
}

export default PopoverToggle;
