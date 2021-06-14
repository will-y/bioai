import React from "react";
import './Popover.css';

class Popover extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        const popover = document.getElementById(this.props.popoverId);

        popover.style.visibility = 'hidden';
        popover.style.opacity = '0';
        popover.style.right = "-33%";
    }

    render() {
        return (
            <div className="popover-container" id={this.props.popoverId}>
                <div className="close-popover" onClick={this.toggle}>{"<"}</div>
                {this.props.children}
            </div>
        );
    }
}

export default Popover;
