import React from 'react';
import './CA.css';
import '../Page.css';
import Popover from "../common/Popover";
import CAPopover from "./CAPopover";
import PopoverToggle from "../common/PopoverToggle";

const squareSize = 25;
const cellsPerRow = 50;
const maxRows = 27;
const liveColor = "#5beb42";
const deadColor = "#D8D4F2";
const borderColor = '#4361A1';

class CA extends React.Component {
    constructor(props) {
        super(props);
        this.simRef = React.createRef();
        this.wolframRef = React.createRef();
        this.state = {
            wolframNumber: 0,
            randomizeStartState: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateWolframNumber = this.updateWolframNumber.bind(this);
        this.start = this.start.bind(this);
        this.play = this.play.bind(this);
        this.stepForward = this.stepForward.bind(this);
        this.stepBackward = this.stepBackward.bind(this);

        this.wolframArray = [0, 0, 0, 0, 0, 0, 0, 0];
        this.graphicsArray = [];
        this.playing = false;
        this.interval = 0;
    }

    componentDidMount() {
        this.simCtx = this.simRef.current.getContext("2d");
        this.wolframCtx = this.wolframRef.current.getContext("2d");
        this.drawWolframPattern();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    // Click Handlers
    updateWolframNumber() {
        this.wolframArray = this.calculateBinaryArray(this.state.wolframNumber);
        this.drawWolframPattern();
    }

    start() {
        this.simCtx.clearRect(0, 0, this.simRef.current.width, this.simRef.current.width);
        this.initializeArray(this.state.randomizeStartState);
        this.drawArray();
    }

    play() {
        if (this.playing) {
            clearInterval(this.interval);
            document.getElementById('play').textContent = 'Play';
        } else {
            document.getElementById('play').textContent = 'Pause';
            let t = this;
            this.interval = setInterval(function() {
               t.stepForward(true);
            }, 100);
        }
        this.playing = !this.playing;
    }

    // Other
    stepForward(showGraphics) {
        const current = this.graphicsArray[this.graphicsArray.length - 1];
        let next = [];
        // wraps around
        for (let i = 0; i < current.length; i++) {
            if (i === 0) {
                next.push(this.calculateNextValue(current[current.length - 1], current[i], current[i + 1]));
            } else if (i === current.length - 1) {
                next.push(this.calculateNextValue(current[i - 1], current[i], current[0]));
            } else {
                next.push(this.calculateNextValue(current[i - 1], current[i], current[i + 1]));
            }
        }

        this.graphicsArray.push(next);
        if (showGraphics) {
            this.drawArray();
        }
    }

    stepBackward() {
        this.graphicsArray = this.graphicsArray.slice(0, this.graphicsArray.length - 1);
        this.simCtx.clearRect(0, 0, this.simRef.current.width, this.simRef.current.height);
        this.drawArray();
    }

    calculateNextValue(left, center, right) {
        return this.wolframArray[left * 2 ** 2 + center * 2 + right]
    }

    drawArray() {
        let row = 0;
        let index = 0;
        let startIndex = 0;
        let t = this;
        if (this.graphicsArray.length > maxRows) {
            startIndex = this.graphicsArray.length - maxRows;
        }
        this.graphicsArray.forEach(function(rowArray) {
            if (index >= startIndex) {
                for (let i = 0; i < rowArray.length; i++) {
                    if (rowArray[i] === 1) {
                        t.simCtx.fillStyle = liveColor;
                    } else {
                        t.simCtx.fillStyle = deadColor;
                    }

                    t.simCtx.fillRect(i * squareSize, row * squareSize, squareSize, squareSize);
                    t.simCtx.beginPath();
                    t.simCtx.strokeStyle = borderColor;
                    t.simCtx.rect(i * squareSize, row * squareSize, squareSize, squareSize);
                    t.simCtx.stroke();
                }
                row++;
            }
            index++;
        });
    }

    initializeArray(randomize) {
        this.graphicsArray = []
        let toAdd = []
        for (let i = 0; i < cellsPerRow; i++) {
            if (randomize) {
                if (Math.random() >= 0.5) {
                    toAdd.push(1)
                } else {
                    toAdd.push(0)
                }
            } else {
                if (i === Math.floor(cellsPerRow / 2)) {
                    toAdd.push(1);
                } else {
                    toAdd.push(0);
                }
            }
        }

        this.graphicsArray.push(toAdd);
    }

    drawWolframPattern() {
        for (let i = 8; i >= 0; i--) {
            this.drawExample(this.wolframArray, i, (7 - i) * (squareSize * 4), 0);
        }
    }

    drawExample(patternNumber, number, x, y) {
        if (number > 7) {
            return;
        }

        let binary = this.calculateBinaryArray(number);

        for (let i = 0; i < 3; i++) {
            // draw square, colored if binary[i] == 1
            if (binary[i] === 1) {
                this.wolframCtx.fillStyle = liveColor;
            } else {
                this.wolframCtx.fillStyle = deadColor;
            }

            this.wolframCtx.fillRect(x + i * squareSize, y, squareSize, squareSize);
            this.wolframCtx.beginPath();
            this.wolframCtx.strokeStyle = borderColor;
            this.wolframCtx.rect(x + i * squareSize, y, squareSize, squareSize);
            this.wolframCtx.stroke();
        }

        if (patternNumber[number] === 1) {
            this.wolframCtx.fillStyle = liveColor;
        } else {
            this.wolframCtx.fillStyle = deadColor;
        }

        this.wolframCtx.fillRect(x + squareSize, y + squareSize + 10    , squareSize, squareSize);
        this.wolframCtx.beginPath();
        this.wolframCtx.strokeStyle = borderColor;
        this.wolframCtx.rect(x + squareSize, y + squareSize + 10, squareSize, squareSize);
        this.wolframCtx.stroke();

        // draw square at position, colored if patterNumber[number] == 1
    }

    calculateBinaryArray(number) {
        if (number > 255 || number < 0) {
            return [];
        }
        let result = [];

        for (let i = 7; i >= 0; i--) {
            let bit = Math.floor(number / (2 ** i));
            result.push(bit);
            number = number - bit * (2 ** i);
        }

        return result.reverse();
    }

    render() {
        return (
          <div className="ca-container">
              <div>
                  <canvas id="wolfram" width="1000px" height="70px" ref={this.wolframRef}/>
                  <br />
                  <input id="wolfram-number"
                         type="number"
                         min="0"
                         max="255"
                         name="wolframNumber"
                         value={this.state.wolframNumber}
                         onChange={this.handleInputChange} />
                  <button id="select" onClick={this.updateWolframNumber}>Select</button>
              </div>
              <div>
                  <button id="start" onClick={this.start}>Start</button>
                  <button id="step-back" onClick={this.stepBackward}>{"<"}</button>
                  <button id="play" onClick={this.play}>Play</button>
                  <button id="step-forward" onClick={() => this.stepForward(true)}>{">"}</button>
                  <label htmlFor="randomize-start-state">Randomize?</label>
                  <input type="checkbox"
                         id="randomize-start-state"
                         name="randomizeStartState"
                         checked={this.state.randomizeStartState}
                         onChange={this.handleInputChange} />
                  <PopoverToggle text="Info" toToggle="ca-popover"/>
                  <br />
                  <canvas id="simulation" width="1500px" height="675px" ref={this.simRef}/>
              </div>
              <Popover popoverId="ca-popover">
                  <CAPopover />
              </Popover>
          </div>
        );
    }
}

export default CA;
