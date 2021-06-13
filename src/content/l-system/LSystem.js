import React from 'react';
import '../Page.css';
import './LSystem.css';

const width = window.innerWidth * 3 / 4;
const height = window.innerHeight * 5 / 6;
const drawColor = '#5beb42';

class LSystem extends React.Component {
    constructor(props) {
        super(props);
        this.lSystemRef = React.createRef();
        this.canvasWrapperRef = React.createRef();
        this.nextRule = 2;
        this.savedString = "";
        this.state = {
            ruleInputs: ["rule0", "rule1"],
            iterations: 5,
            rule0Start: "A",
            rule0End: "A[+A][-A]",
            rule1Start: "",
            rule1End: "",
            axiom: "A",
            rotateAngle: Math.PI / 4,
            distance: 10,
            xStart: width / 2,
            yStart: height - 50,
            width: width,
            height: height
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.createRules = this.createRules.bind(this);
        this.runSystem = this.runSystem.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount() {
        this.ctx = this.lSystemRef.current.getContext("2d");
        this.runSystem();
        this.updateCanvas();
        window.addEventListener('resize', this.updateCanvas);
    }

    updateCanvas() {
        if (this.canvasWrapperRef.current) {
            this.setState({
                width: this.canvasWrapperRef.current.offsetWidth,
                height: Math.min(this.canvasWrapperRef.current.offsetHeight, window.innerHeight - 100),
                xStart: this.canvasWrapperRef.current.offsetWidth / 2,
                yStart: this.canvasWrapperRef.current.offsetHeight - 50
            }, () => {
                this.drawString(this.savedString);
            });
        }
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            if (name === "xStart" || name === "yStart" || name === "distance" || name === "rotateAngle") {
                this.drawString(this.savedString);
            } else {
                this.runSystem();
            }
        });
    }

    addRule() {
        this.setState((prevState, props) => ({
            ruleInputs: prevState.ruleInputs.concat(`rule${this.nextRule}`),
            [`rule${this.nextRule}Start`]: "",
            [`rule${this.nextRule}End`]: ""
        }), () => {
            this.nextRule++;
        });
    }

    createRules() {
        const rules = new Map();
        for (let i = 0; i < this.nextRule; i++) {
            if (this.state[`rule${i}Start`] !== '' && this.state[`rule${i}End`] !== '') {
                rules.set(this.state[`rule${i}Start`], this.state[`rule${i}End`]);
            }
        }

        return rules;
    }

    runSystem() {
        let axiom = this.state.axiom;
        const iterations = this.state.iterations;
        const rules = this.createRules();

        for (let i = 0; i < iterations; i++) {
            axiom = this.applyRules(rules, axiom);
        }

        // draw

        this.savedString = axiom;
        this.drawString(axiom);

        return axiom;
    }

    applyRules(rules, axiom) {
        let result = '';

        for (let i = 0; i < axiom.length; i++) {
            const char = axiom.charAt(i);
            const val = rules.get(char);

            if (val) {
                result = result.concat(val);
            } else {
                result = result.concat(char.toString());
            }
        }

        return result;
    }

    // Options:
    // - = rotate left
    // + = rotate right
    // [ = push to stack
    // ] = pop from stack
    // Anything else: Move forward
    drawString(toDraw) {
        let x = parseFloat(this.state.xStart);
        let y = parseFloat(this.state.yStart);
        let currentAngle = Math.PI / 2;
        const branches = [];

        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
        this.ctx.beginPath();
        this.ctx.strokeStyle = drawColor;
        this.ctx.moveTo(x, y);

        for (let i = 0; i < toDraw.length; i++) {
            const char = toDraw.charAt(i);

            switch (char) {
                case '-':
                    currentAngle -= parseFloat(this.state.rotateAngle);
                    break;
                case '+':
                    currentAngle += parseFloat(this.state.rotateAngle);
                    break;
                case '[':
                    branches.push({
                        x: x,
                        y: y,
                        currentAngle: currentAngle
                    });
                    break;
                case ']':
                    const newPosition = branches.pop();
                    x = newPosition.x;
                    y = newPosition.y;
                    currentAngle = newPosition.currentAngle;

                    this.ctx.moveTo(x, y);
                    break;
                default:
                    x = x + Math.cos(currentAngle) * this.state.distance;
                    y = y - Math.sin(currentAngle) * this.state.distance;

                    this.ctx.lineTo(x, y);
                    break;
            }
        }
        this.ctx.stroke();
    }

    render() {
        return (
            <div className="l-container">
                <div className="form-container">
                    <div className="rule-container">
                        <label htmlFor="axiom">Axiom: </label>
                        <input className="rule-input"
                               name="axiom"
                               value={this.state.axiom}
                               onChange={this.handleInputChange}/>
                    </div>
                    {this.state.ruleInputs.map((item, index) => {
                        return (
                            <div className="rule-container" key={item}>
                                <label htmlFor={`${item}-start`} className="rule-label">Rule {index}: </label>
                                <input className="rule-input rule-input-start"
                                       name={`${item}Start`}
                                       value={this.state[item + "Start"]}
                                       onChange={this.handleInputChange}
                                       size={1}
                                       maxLength={1}/>
                                <label htmlFor={`${item}-end`} className="rule-label">-></label>
                                <input className="rule-input rule-input-end"
                                       name={`${item}End`}
                                       value={this.state[item + "End"]}
                                       onChange={this.handleInputChange} />
                            </div>
                        );
                    })}
                    <button className="add-rule" onClick={this.addRule}>Add Rule</button>
                    <h3>Settings</h3>
                    <label htmlFor="iterations">Iterations: {this.state.iterations}</label>
                    <input className="iterations"
                           type="range"
                           min={1}
                           max={10}
                           value={this.state.iterations}
                           onChange={this.handleInputChange}
                           name="iterations"/>
                    <label htmlFor="x" id="x-label">X Start: {this.state.xStart}</label>
                    <input type="range"
                           min={0}
                           max={this.state.width}
                           value={this.state.xStart}
                           id="x"
                           name="xStart"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="y" id="y-label">Y Start: {this.state.yStart}</label>
                    <input type="range"
                           min={0}
                           max={this.state.height}
                           value={this.state.yStart}
                           id="y"
                           name="yStart"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="distance" id="distance">Distance: {this.state.distance}</label>
                    <input type="range"
                           min={1}
                           max={200}
                           value={this.state.distance}
                           id="distance"
                           name="distance"
                           onChange={this.handleInputChange}/>
                    <label htmlFor="rotate" id="distance">Rotate Angle: {parseFloat(this.state.rotateAngle).toFixed(3)}</label>
                    <input type="range"
                           min={0}
                           max={Math.PI * 2}
                           value={this.state.rotateAngle}
                           id="rotate"
                           name="rotateAngle"
                           onChange={this.handleInputChange}
                           step={0.001}/>
                </div>
                <div className="canvas-wrapper" ref={this.canvasWrapperRef}>
                    <canvas width={this.state.width} height={this.state.height} ref={this.lSystemRef} id="canvas"/>
                </div>
            </div>
            );
    }
}

export default LSystem;
