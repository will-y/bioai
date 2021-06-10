import React from "react";
import './Boids.css';
import '../Page.css';

const numBoids = 100;
const width = 1000;
const height = 800;
let boids = [];

class Boids extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boidRadius: 4,
            repelDistance: 25,
            speedLimit: 20,
            attraction: 100,
            dotAttraction: 50
        };

        this.playing = false;
        this.interval = null;
        this.attractorX = -1;
        this.attractorY = -1;
        this.rx = 1;
        this.ry = 1;
        this.rvx = Math.floor(Math.random() * 10 - 5);
        this.rvy = Math.floor(Math.random() * 10 - 5);

        this.canvasRef = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.start = this.start.bind(this);
        this.canvasClickHandler = this.canvasClickHandler.bind(this);
        this.step = this.step.bind(this);
        this.drawBoids = this.drawBoids.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext("2d");
        this.initializeBoids();
        this.drawBoids();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    start() {
        if (this.playing) {
            clearInterval(this.interval);
            this.playing = false;
            document.getElementById('start').textContent = 'Start';
        } else {
            let t = this;
            this.interval = setInterval(t.step, 50);
            this.playing = true;
            document.getElementById('start').textContent = 'Pause';
        }
    }

    reset() {
        this.setState({
            boidRadius: 4,
            repelDistance: 25,
            speedLimit: 20,
            attraction: 100,
            dotAttraction: 50
        }, () => {
            this.drawBoids();
        });
        this.attractorY = -1;
        this.attractorX = -1;
        this.initializeBoids();
        this.playing = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        document.getElementById('start').textContent = 'Start';
    }

    canvasClickHandler(e) {
        const pos = this.getMousePosition(this.canvasRef.current, e);
        this.attractorX = pos[0];
        this.attractorY = pos[1];
        this.drawBoids();
    }

    initializeBoids() {
        boids = [];
        for (let i = 0; i < numBoids; i++) {
            boids.push({
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                vx: Math.floor(Math.random() * 10 - 5),
                vy: Math.floor(Math.random() * 10 - 5)
            });
        }
    }

    drawBoids() {
        console.log(this.state.boidRadius)
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = 'green';
        for (let i = 0; i < numBoids; i++) {
            const boid = boids[i];
            this.ctx.beginPath();
            this.ctx.arc(boid.x, boid.y, this.state.boidRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.fillStyle = 'blue';
        if (this.attractorX !== -1) {
            this.ctx.beginPath();
            this.ctx.arc(this.attractorX, this.attractorY, this.state.boidRadius * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // predator
        this.ctx.fillStyle = 'red';
        if (this.rx !== -1) {
            this.ctx.beginPath();
            this.ctx.arc(this.rx, this.ry, this.state.boidRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    step() {
        for (let i = 0; i < numBoids; i++) {
            const v1 = this.rule1(i);
            const v2 = this.rule2(i);
            const v3 = this.rule3(i);
            const v4 = this.rule4(i);
            const v5 = this.rule5(i);
            const v6 = this.rule6(i);

            const v = this.limitVelocity(boids[i].vx + v1[0] + v2[0] + v3[0] + v4[0] + v5[0] + v6[0], boids[i].vy + v1[1] + v2[1] + v3[1] + v4[1] + v5[1] + v6[1])

            boids[i].vx = v[0]
            boids[i].vy = v[1]
            boids[i].x = (boids[i].x + boids[i].vx)
            boids[i].y = (boids[i].y + boids[i].vy)
        }

        // predator
        if (this.rx !== -1) {
            const v1 = this.rule1_pos(this.rx, this.ry, 0);
            const v4 = this.rule4_pos(this.rx, this.ry);

            const v = this.limitVelocity(this.rvx + v1[0] + v4[0], this.rvy + v1[1] + v4[1]);

            this.rvx = v[0];
            this.rvy = v[1];
            this.rx = this.rx + this.rvx;
            this.ry = this.ry + this.rvy;
        }

        this.drawBoids();
    }

    rule1(boidNum) {
        return this.rule1_pos(boids[boidNum].x, boids[boidNum].y, boidNum);
    }

    rule1_pos(x, y, boidNum) {
        const result = [0, 0];
        for (let i = 0; i < numBoids; i++) {
            if (i !== boidNum) {
                result[0] += boids[i].x;
                result[1] += boids[i].y;
            }
        }

        result[0] = result[0] / (numBoids - 1);
        result[1] = result[1] / (numBoids - 1);

        result[0] = (result[0] - x) / this.state.attraction;
        result[1] = (result[1] -y) / this.state.attraction;

        return result
    }

    rule2(boidNum) {
        const result = [0, 0]

        for (let i = 0; i < numBoids; i++) {
            if (i !== boidNum) {
                if (this.distance(boids[i], boids[boidNum]) < this.state.repelDistance) {
                    result[0] = result[0] - (boids[i].x - boids[boidNum].x);
                    result[1] = result[1] - (boids[i].y - boids[boidNum].y);
                }
            }
        }

        return result;
    }

    rule3(boidNum) {
        const result = [0, 0];
        for (let i = 0; i < numBoids; i++) {
            if (i !== boidNum) {
                result[0] += boids[i].vx;
                result[1] += boids[i].vy;
            }
        }

        result[0] = result[0] / (numBoids - 1);
        result[1] = result[1] / (numBoids - 1);

        result[0] = (result[0] - boids[boidNum].vx) / 8;
        result[1] = (result[1] - boids[boidNum].vy) / 8;

        return result
    }

// stay on screen
    rule4(boidNum) {
        const boid = boids[boidNum];

        return this.rule4_pos(boid.x, boid.y);
    }

    rule4_pos(x, y) {
        const result = [0, 0];

        if (x > width - 20) {
            result[0] = -5;
        } else if (x < 20) {
            result[0] = 5;
        }

        if (y > height - 20) {
            result[1] = -5;
        } else if (y < 20) {
            result[1] = 5;
        }

        return result;
    }

// attracted to the blue circle
    rule5(boidNum) {
        const result = [0, 0]
        if (this.attractorX !== -1) {
            result[0] = (this.attractorX - boids[boidNum].x) / this.state.dotAttraction;
            result[1] = (this.attractorY - boids[boidNum].y) / this.state.dotAttraction;
        }

        return result;
    }

// scared of predator
    rule6(boidNum) {
        const result = [0, 0];
        if (this.rx !== -1) {
            result[0] = (boids[boidNum].x - this.rx) / (this.state.dotAttraction * 3);
            result[1] = (boids[boidNum].y - this.ry) / (this.state.dotAttraction * 3);
        }

        return result;
    }

    distance(boid1, boid2) {
        return Math.sqrt((boid1.x - boid2.x) ** 2 + (boid1.y - boid2.y) ** 2);
    }

    limitVelocity(vx, vy, isPredator=false) {
        const mag = Math.sqrt(vx ** 2 + vy ** 2);
        let sl;
        if (isPredator) {
            sl = this.state.speedLimit * (2/3);
        } else {
            sl = this.state.speedLimit;
        }

        if (mag > sl) {
            return [vx * sl / mag, vy * sl / mag];
        } else {
            return [vx, vy];
        }
    }

    // got this from https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
    getMousePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        return [x, y];
    }

    render() {
        return (
            <div className="ca-container boids-container">
                <canvas id="boids-canvas"
                        width="1000px"
                        height="800px"
                        ref={this.canvasRef} onMouseDown={this.canvasClickHandler}/>
                <div className="sliders">
                    <button id="start" onClick={this.start}>Start</button>
                    <button id="reset" onClick={this.reset}>Reset</button>
                    <label htmlFor="radius" id="radius-label">Radius: {this.state.boidRadius}</label>
                    <input type="range"
                           className="boids-input"
                           min="1"
                           max="20"
                           value={this.state.boidRadius}
                           id="radius"
                           name="boidRadius"
                           onChange={this.handleInputChange}
                           onInput={this.drawBoids}/>
                    <label htmlFor="repel" id="repel-label">Repel: {this.state.repelDistance}</label>
                    <input type="range"
                           className="boids-input"
                           min="0"
                           max="200"
                           value={this.state.repelDistance}
                           id="repel"
                           name="repelDistance"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="speed" id="speed-label">Speed Limit: {this.state.speedLimit}</label>
                    <input type="range"
                           className="boids-input"
                           min="0"
                           max="200"
                           value={this.state.speedLimit}
                           id="speed"
                           name="speedLimit"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="attraction" id="attraction-label">CoM Attraction: {this.state.attraction}</label>
                    <input type="range"
                           className="boids-input"
                           min="1"
                           max="200"
                           value={this.state.attraction}
                           id="attraction"
                           name="attraction"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="dot-attraction" id="dot-attraction-label">Dot Attraction: {this.state.dotAttraction}</label>
                    <input type="range"
                           className="boids-input"
                           min="1"
                           max="200"
                           value={this.state.dotAttraction}
                           id="dot-attraction"
                           name="dotAttraction"
                           onChange={this.handleInputChange}/>
                </div>
            </div>
        );
    }
}

export default Boids;
