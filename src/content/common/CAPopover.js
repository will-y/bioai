import React from "react";
import './Popover.css';

class CAPopover extends React.Component {
    render() {
        return (
            <div>
                <h1>One Dimensional Cellular Automata</h1>
                <h2>Background</h2>
                <p>Every iteration (line of squares) each square is updated based on the three squares above it. The transition rules are shown at the top of the screen.</p>
                <h2>How to Use the App</h2>
                <ol>
                    <li>Select the transition rule. The rule is just determined by one number, see <a href="https://mathworld.wolfram.com/ElementaryCellularAutomaton.html" target="_blank" rel="noreferrer">here</a> for more information.</li>
                    <li>To set the number, enter it into the box and hit select. You will see the pattern above the box.</li>
                    <li>Clicking the start button will add an initial row to the start. If the randomize option is selected, it will create a random row, if it is off, only the center square will be alive.</li>
                    <li>Click play to start the simulation playing.</li>
                    <li>The arrows can be used to step the simulation one step forward or backward.</li>
                </ol>
            </div>
        );
    }
}

export default CAPopover;
