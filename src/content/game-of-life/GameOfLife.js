import React from 'react';
import './GameOfLife.css';
import '../Page.css';

const gridCount = 50;
const gridSize = 13;
const fillProbability = 0.35;
const neighborArray = [-1, 0, 1];
const liveColor = "#5beb42";
const deadColor = "#D8D4F2";
const borderColor = '#4361A1';

class GameOfLife extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.gameState = Array.from(Array(gridCount), _ => Array(gridCount).fill(0));
        this.interval = 0;

        // Click Handlers
        this.randomize = this.randomize.bind(this);
        this.start = this.start.bind(this);
        this.step = this.step.bind(this);
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");
    }

    randomize() {
        for (let i = 0; i < gridCount; i++) {
            for (let j = 0; j < gridCount; j++) {
                if (Math.random() < fillProbability) {
                    this.gameState[i][j] = 1;
                } else {
                    this.gameState[i][j] = 0;
                }
            }
        }

        this.displayGrid();
    }

    start() {
        this.interval = setInterval(this.step, 50);
    }

    step() {
        let nextState = Array.from(Array(gridCount), _ => Array(gridCount).fill(0));
        for (let i = 0; i < gridCount; i++) {
            for (let j = 0; j < gridCount; j++) {
                let neighbors = this.countNeighbors(i, j, this.gameState, gridCount, true);
                if (this.gameState[i][j] === 0) {
                    // dead
                    if (neighbors === 3) {
                        nextState[i][j] = 1;
                    }
                } else {
                    // alive
                    if (neighbors !== 2 && neighbors !== 3) {
                        nextState[i][j] = 0;
                    } else {
                        nextState[i][j] = 1;
                    }
                }
            }
        }
        this.gameState = nextState;
        this.displayGrid();
    }

    countNeighbors(i, j, state, size) {
        let count = 0;
        let newX = 0;
        let newY = 0;
        neighborArray.forEach(function(x) {
            neighborArray.forEach(function(y) {
                newX = i + x;
                newY = j + y;
                if (newX >= 0 && newY >= 0 && newX <= size - 1 && newY <= size - 1 && !(x === 0 && y === 0)) {
                    if (state[newX][newY] === 1) {
                        count++;
                    }
                }
            })
        })
        return count;
    }

    displayGrid() {
        for (let i = 0; i < gridCount; i++) {
            for (let j = 0; j < gridCount; j++) {
                if (this.gameState[i][j] === 1) {
                    this.ctx.fillStyle = liveColor;
                } else {
                    this.ctx.fillStyle = deadColor;
                }
                this.ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
                this.ctx.beginPath();
                this.ctx.strokeStyle = borderColor;
                this.ctx.rect(i * gridSize, j * gridSize, gridSize, gridSize);
                this.ctx.stroke();
            }
        }
    }


    render() {
        return (
          <div className={"ca-container"}>
              <button id="randomize" onClick={this.randomize}>Create Random State</button>
              <button id="start-game-of-life" onClick={this.start}>Start</button>
              <button id="step-game-of-life" onClick={this.step}>Step</button>
              <button id="stop-game-of-life" onClick={() => clearInterval(this.interval)}>Stop</button>
              <br />
              <canvas id="game-of-life-canvas" width={gridCount* gridSize} height={gridCount* gridSize} ref={this.canvasRef}/>
          </div>
        );
    }
}

export default GameOfLife;
