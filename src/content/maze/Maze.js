import React from 'react';
import './Maze.css';
import '../Page.css';
import MazeBuilder from './MazeBuilder';
import Popover from "../common/Popover";
import MazePopover from "./MazePopover";
import PopoverToggle from "../common/PopoverToggle";
import Timer from "../common/Timer";

class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.mazeRef = React.createRef();

        this.state = {
            speed: 100
        }

        this.stepMaze = this.stepMaze.bind(this);
        this.start = this.start.bind(this);
        this.reset = this.reset.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.timer = new Timer(this.stepMaze, 200 - this.state.speed);
        this.reset();

    }

    componentDidMount() {
        this.mazeCtx = this.mazeRef.current.getContext("2d");
        this.mazeBuilder.draw(this.mazeCtx);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name === 'speed') {
            this.timer.changeTime(200 - value);
        }
        this.setState({
            [name]: value
        });
    }

    reset() {
        this.size = 50;
        this.mazeBuilder = new MazeBuilder(this.size / 2, this.size / 2);
        this.size++;
        this.maze = this.mazeBuilder.maze;
        this.timer.pause();
        this.active = false;

        if (this.mazeCtx) {
            this.mazeBuilder.draw(this.mazeCtx);
        }
    }

    start() {
        if (this.active) {
            this.timer.pause();
            this.active = false;
        } else {
            this.active = true;
            this.timer.start();
        }
    }

    stepMaze() {
        let newMaze = this.mazeBuilder.initArray()
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const neighbors = this.countSquareNeighbors(i, j);
                if (this.maze[i][j] === 0 && neighbors === 1) {
                    newMaze[i][j] = 1;
                } else if (this.maze[i][j] === 1) {
                    newMaze[i][j] = 1;
                } else if (this.maze[i][j] === 2) {
                    newMaze[i][j] = 2;
                }
            }
        }
        this.maze = newMaze
        this.mazeBuilder.draw(this.mazeCtx, this.maze);
    }

    countSquareNeighbors(i, j) {
        let count = 0;

        if (i + 1 < this.size && (this.maze[i+1][j] === 0 || this.maze[i+1][j] === 2)) {
            count++;
        }

        if (i - 1 >= 0 && (this.maze[i-1][j] === 0 || this.maze[i-1][j] === 2)) {
            count++;
        }

        if (j + 1 < this.size && (this.maze[i][j+1] === 0 || this.maze[i][j+1] === 2)) {
            count++;
        }

        if (j - 1 >= 0 && (this.maze[i][j-1] === 0 || this.maze[i][j-1] === 2)) {
            count++;
        }

        return count;
    }

    render() {
        return (
          <div className="ca-container">
              <div className="controls-container">
                  <button id="start-maze" onClick={this.start}>Run Maze Solver</button>
                  <button id="step-maze" onClick={this.stepMaze}>Step</button>
                  <button id="reset" onClick={this.reset}>Reset</button>
                  <PopoverToggle text="Info" toToggle="maze-popover"/>
                  <label htmlFor="speed">Speed: </label>
                  <input type="range"
                         name="speed"
                         value={this.state.speed}
                         onChange={this.handleInputChange}
                         min={0}
                         max={200}/>
              </div>
              <canvas id="maze-canvas" width="1000px" height="550px" ref={this.mazeRef}/>
              <Popover popoverId="maze-popover">
                <MazePopover />
              </Popover>
          </div>
        );
    }
}

export default Maze;
