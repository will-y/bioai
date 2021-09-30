import React from "react";
import '../common/Popover.css';

class LSystemPopover extends React.Component {
    render() {
        return (
            <div>
                <h2>L System Simulator</h2>
                <h3>Background</h3>
                <p>An L-System is a series of rules to modify an initial string (axiom). Each iteration, each character is replaced with another sequence of characters defined by the transition rules. More information can be found <a href="https://en.wikipedia.org/wiki/L-system" target="_blank" rel="noreferrer">here.</a></p>
                <h3>How it Draws</h3>
                <p>All an L-System does is generate a string based on an initial string and rules. This program takes this created string and then draws it with turtle graphics. It draws based on the following rules:</p>
                <ul>
                    <li><span className="def">'-'</span> Rotate Left</li>
                    <li><span className="def">'+'</span> Rotate Right</li>
                    <li><span className="def">'['</span> Push the current position and rotation onto a stack</li>
                    <li><span className="def">']'</span> Pop from the stack and set the position and rotation</li>
                    <li><span className="def">else,</span> move forward</li>
                </ul>
                <h3>How to Use the App</h3>
                <p>When any setting is changed, the drawing on the right will update in real time.</p>
                <h4>Rules</h4>
                <p>By default, a ruleset for making binary trees is inputted. In order to make custom rules, first input an axiom. Then input any number of rules. The first character is what will be replaced, the second box can be any number of characters to replace it with. If you need more rules, click the Add Rule button.</p>
                <h4>Settings</h4>
                <h5>Iterations [1-10]</h5>
                <p>This determines how many times the rules are applied to the string. (Note: it is capped at 10 because going higher starts to lag the drawing.)</p>
                <h5>X/Y Start</h5>
                <p>These determine the place on the canvas where the drawing starts.</p>
                <h5>Distance [1-200]</h5>
                <p>Determines the distance that is drawn forward.</p>
                <h5>Rotation Angle [0-2&#960;]</h5>
                <p>Determines the angle (in radians) that the turtle rotates on a '-' or '+'.</p>
            </div>
        );
    }
}

export default LSystemPopover;
