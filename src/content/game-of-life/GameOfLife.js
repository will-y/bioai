import React from 'react';
import './GameOfLife.css';

class GameOfLife extends React.Component {
    render() {
        return (
          <div>
              <button id="randomize">Create Random State</button>
              <button id="start-game-of-life">Start</button>
              <button id="step-game-of-life">Step</button>
              <button id="stop-game-of-life">Stop</button>
              <br />
              <canvas id="game-of-life-canvas" width="1000px" height="800px" />
          </div>
        );
    }
}

export default GameOfLife;
