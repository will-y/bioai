import React from 'react';
import './GameOfLife.css';
import '../Page.css';
import Popover from "../common/Popover";
import GameOfLifePopover from "./GameOfLifePopover";
import PopoverToggle from "../common/PopoverToggle";
import Timer from "../common/Timer";

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
        this.gameState = this.getInitialGameState();

        this.state = {
            speed: 100
        }
        const t = this;
        this.timer = new Timer(() => {
            t.step();
        }, 200 - this.state.speed);
        this.playing = false;
        this.valid = false;

        // Click Handlers
        this.randomize = this.randomize.bind(this);
        this.start = this.start.bind(this);
        this.step = this.step.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.reset = this.reset.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");
        this.displayGrid();
    }

    getInitialGameState() {
        return Array.from(Array(gridCount), _ => Array(gridCount).fill(0));
    }

    reset() {
        this.timer.pause();
        this.playing = false;
        this.valid = false;
        document.getElementById('start-game-of-life').textContent = 'Play';
        this.gameState = this.getInitialGameState();
        this.displayGrid();
    }

    randomize() {
        this.valid = true;
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
        if (!this.valid) {
            this.randomize();
        }
        if (!this.playing) {
            document.getElementById('start-game-of-life').textContent = 'Pause';
            this.timer.start();
        } else {
            document.getElementById('start-game-of-life').textContent = 'Play';
            this.timer.pause();
        }
        this.playing = !this.playing;
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
        neighborArray.forEach(function (x) {
            neighborArray.forEach(function (y) {
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

    handleCanvasClick(event) {
        this.toggleSquare(this.canvasRef.current, event);
        this.valid = true;
    }

    toggleSquare(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const x = Math.floor(canvasX / gridSize);
        const y = Math.floor(canvasY / gridSize);

        const curState = this.gameState[x][y];

        this.gameState[x][y] = (curState + 1) % 2;
        this.displayGrid();
    }

    render() {
        return (
            <div className={"ca-container"}>
                <div className="controls-container">
                    <button id="randomize" onClick={this.randomize}>Create Random State</button>
                    <button id="start-game-of-life" onClick={this.start}>Play</button>
                    <button id="step-game-of-life" onClick={this.step}>Step</button>
                    <button onClick={this.reset}>Reset</button>
                    <PopoverToggle text="Info" toToggle="gol-popover"/>
                    <label htmlFor="speed">Speed: </label>
                    <input type="range"
                           name="speed"
                           value={this.state.speed}
                           onChange={this.handleInputChange}
                           min={0}
                           max={200}/>
                </div>
                <canvas id="game-of-life-canvas" width={gridCount * gridSize} height={gridCount * gridSize}
                        ref={this.canvasRef} onMouseDown={this.handleCanvasClick}/>
                <Popover popoverId="gol-popover">
                    <GameOfLifePopover/>
                </Popover>
            </div>
        );
    }
}

export default GameOfLife;
