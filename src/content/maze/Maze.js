import React from 'react';
import './Maze.css';
import MazeBuilder from './MazeBuilder';

class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.mazeRef = React.createRef();
        this.size = 50;
        this.mazeBuilder = new MazeBuilder(this.size / 2, this.size / 2);
        this.size++;
        this.maze = this.mazeBuilder.maze;
        this.mazeInterval = 0;
        this.active = false;

        this.stepMaze = this.stepMaze.bind(this);
        this.start = this.start.bind(this);
    }

    componentDidMount() {
        this.mazeCtx = this.mazeRef.current.getContext("2d");
        this.mazeBuilder.draw(this.mazeCtx);
    }

    start() {
        if (this.active && this.mazeInterval) {
            clearInterval(this.mazeInterval);
            this.active = false;
        } else {
            this.active = true;
            this.mazeInterval = setInterval(this.stepMaze, 100);
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
              <button id="start-maze" onClick={this.start}>Run Maze Solver</button>
              <button id="step-maze" onClick={this.stepMaze}>Step</button>
              <br />
              <canvas id="maze-canvas" width="1000px" height="1000px" ref={this.mazeRef}/>
          </div>
        );
    }
}

export default Maze;
