import React from "react";
import '../common/Popover.css';

class MazePopover extends React.Component {
    render() {
        return (
            <div>
                <h2>Solving a Maze with Cellular Automata</h2>
                <h3>Background</h3>
                <p>This is a simple program to solve a random maze using cellular automata. There are three states: path, wall, and start. The transition rules are the following:</p>
                <ol>
                    <li>Start states (the beginning and end of the maze) always stay as start states.</li>
                    <li>Wall states always stay as wall states.</li>
                    <li>For each path state, turn it into a wall state if it only has one other path neighbor.</li>
                </ol>
                <p>This causes all of the dead ends to be "eaten" away and what is left is the solution to the maze.</p>
                <h3>Maze Generation</h3>
                <p>I didn't write the maze generation code. The original source is <a href="https://www.the-art-of-web.com/javascript/maze-generator/" target="_blank" rel="noreferrer">here.</a> There is a good article about how it works there. I modified it slightly to draw how I wanted it and to be able to access the data in the way I needed it.</p>
                <h3>How to Use the App</h3>
                <ol>
                    <li>A random maze in generated initially.</li>
                    <li>Press Run Maze Solver to start the solver. Press it again to pause.</li>
                    <li>At any point, press the Step button to advance the solver one step.</li>
                    <li>To generate a new maze, press the Reset button.</li>
                </ol>
            </div>
        );
    }
}

export default MazePopover;
