import React from "react";
import '../common/Popover.css';

class GameOfLifePopover extends React.Component {
    render() {
        return (
            <div>
                <h2>Conway's Game of Life</h2>
                <h3>Background</h3>
                <p>Every cell is either alive (green) or dead (white). A cell's neighbors are the eight cells around it. Every frame, cells are updated by the following rules:</p>
                <ol>
                    <li>Any alive cell with two or three alive neighbors survives.</li>
                    <li>And dead cell with exactly three alive neighbors comes alive.</li>
                    <li>All other alive cells die and all other dead cells stay dead.</li>
                </ol>
                <p>For more information see <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noreferrer">here.</a></p>
                <h3>How to Use the App</h3>
                <ol>
                    <li>Click the Create Random State button to generate a random set of alive and dead cells.</li>
                    <li>Press Start to start the simulation. Press again to pause.</li>
                    <li>Press Step to go forward one step.</li>
                    <li>Press Reset to clear the board.</li>
                </ol>
                <p>You can also click on any square in the simulation at any time to toggle its state.</p>
                <h3>Cool Patterns</h3>
                <p>Check out <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns" target="_blank" rel="noreferrer">this</a> for some patterns.</p>
            </div>
        );
    }
}

export default GameOfLifePopover;
