import React from 'react';
import '../Page.css';
import './LSystem.css';

class LSystem extends React.Component {
    constructor(props) {
        super(props);
        this.lSystemRef = React.createRef();
        this.nextRule = 2;
        this.state = {
            ruleInputs: ["rule0", "rule1"],
            iterations: 6,
            rule0Start: "",
            rule0End: "",
            rule1Start: "",
            rule1End: "",
            axiom: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.createRules = this.createRules.bind(this);
        this.runSystem = this.runSystem.bind(this);
    }

    componentDidMount() {
        this.ctx = this.lSystemRef.current.getContext("2d");
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
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

        console.log(rules);
        return rules;
    }

    runSystem() {
        let axiom = this.state.axiom;
        const iterations = this.state.iterations;
        const rules = this.createRules();

        for (let i = 0; i < iterations; i++) {
            axiom = this.applyRules(rules, axiom);
        }

        console.log(axiom);

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
                    <input className="iterations"
                           value={this.state.iterations}
                           onChange={this.handleInputChange}
                           name="iterations"/>
                    <button className="add-rule" onClick={this.runSystem}>Draw</button>
                </div>
                <canvas width="1000px" height="700px" ref={this.lSystemRef}/>
            </div>
            );
    }
}

export default LSystem;