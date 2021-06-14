import React from "react";
import "./Popover.css";

class PopoverToggle extends React.Component {
    constructor(props) {
        super(props);
        this.togglePopover = this.togglePopover.bind(this);
    }

    togglePopover() {
        const vis = document.getElementById(this.props.toToggle).style.visibility;
        const popover = document.getElementById(this.props.toToggle);

        popover.style.visibility = ((vis === "hidden" || vis === "") ? "visible" : "hidden");
        popover.style.opacity = ((vis === "hidden" || vis === "") ? "1": "0");
        popover.style.right =  ((vis === "hidden" || vis === "") ? "0": "-33%");
    }

    render() {
        return (
            <button onClick={this.togglePopover} className={this.props.buttonClass}>
                {this.props.text}
            </button>
        );
    }
}

export default PopoverToggle;
