import React from "react";
import '../common/Popover.css';

class CAPopover extends React.Component {
    render() {
        return (
            <div>
                <h2>One Dimensional Cellular Automata</h2>
                <h3>Background</h3>
                <p>Every iteration (row of squares) each square is updated based on the three squares above it. The transition rules are shown at the top of the screen.</p>
                <h3>How to Use the App</h3>
                <ol>
                    <li>Select the transition rule. The rule is just determined by one number, see <a href="https://mathworld.wolfram.com/ElementaryCellularAutomaton.html" target="_blank" rel="noreferrer">here</a> for more information. The area above the input box will show the transition rules.</li>
                    <li>Clicking the start button will add an initial row to the start. If the randomize option is selected, it will create a random row, if it is off, only the center square will be alive.</li>
                    <li>Click play to start the simulation playing.</li>
                    <li>The arrows can be used to step the simulation one step forward or backward.</li>
                    <li>The speed slider determines how fast the simulation goes, the further to the right, the faster it will go. Note: it pauses when slowing it down, it will start at the new speed when the slider has stopped moving.</li>
                </ol>
                <h3>Cool Transition Rules</h3>
                <ul>
                    <li><a href="https://en.wikipedia.org/wiki/Rule_30" target="_blank" rel="noreferrer">Rule 30</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Rule_90" target="_blank" rel="noreferrer">Rule 90</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Rule_110" target="_blank" rel="noreferrer">Rule 110</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Rule_184" target="_blank" rel="noreferrer">Rule 184</a></li>
                </ul>
            </div>
        );
    }
}

export default CAPopover;
