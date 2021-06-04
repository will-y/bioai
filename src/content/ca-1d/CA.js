import React from 'react';
import './CA.css';

const squareSize = 25;

class CA extends React.Component {
    constructor(props) {
        super(props);
        this.simRef = React.createRef();
        this.wolframRef = React.createRef();
        this.state = {
            wolframNumber: 0,
            randomizeStartState: false,
            runs: 1
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateWolframNumber = this.updateWolframNumber.bind(this);
        this.wolframArray = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    componentDidMount() {
        this.simCtx = this.simRef.current.getContext("2d");
        this.wolframCtx = this.wolframRef.current.getContext("2d");
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    updateWolframNumber() {
        this.wolframArray = this.calculateBinaryArray(this.state.wolframNumber);
        this.drawWolframPattern();
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
                this.wolframCtx.fillStyle = 'green';
            } else {
                this.wolframCtx.fillStyle = 'white';
            }

            this.wolframCtx.fillRect(x + i * squareSize, y, squareSize, squareSize);
            this.wolframCtx.beginPath();
            this.wolframCtx.strokeStyle = 'black';
            this.wolframCtx.rect(x + i * squareSize, y, squareSize, squareSize);
            this.wolframCtx.stroke();
        }

        if (patternNumber[number] === 1) {
            this.wolframCtx.fillStyle = 'green';
        } else {
            this.wolframCtx.fillStyle = 'white';
        }

        this.wolframCtx.fillRect(x + squareSize, y + squareSize + 10    , squareSize, squareSize);
        this.wolframCtx.beginPath();
        this.wolframCtx.strokeStyle = 'black';
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
                  <button id="start">Start</button>
                  <button id="step-back">{"<"}</button>
                  <button id="play">Play</button>
                  <button id="step-forward">{">"}</button>
                  <label htmlFor="randomize-start-state">Randomize?</label>
                  <input type="checkbox"
                         id="randomize-start-state"
                         name="randomizeStartState"
                         checked={this.state.randomizeStartState}
                         onChange={this.handleInputChange} />
                  <label htmlFor="runs">Runs: </label>
                  <input type="number"
                         id="runs"
                         name="runs"
                         value={this.state.runs}
                         onChange={this.handleInputChange}/>
                  <button id="run-simulation">Run Simulation</button>
                  <br />
                  <canvas id="simulation" width="1500px" height="700px" ref={this.simRef}/>
              </div>
          </div>
        );
    }
}

export default CA;
