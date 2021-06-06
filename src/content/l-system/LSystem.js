import React from 'react';
import '../Page.css';
import './LSystem.css';

class LSystem extends React.Component {
    constructor(props) {
        super(props);
        this.lSystemRef = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.lSystemRef.current.getContext("2d");
    }

    runSystem(axiom, rules, iterations) {
        for (let i = 0; i < iterations; i++) {
            axiom = this.applyRules(rules, axiom);
        }

        return axiom;
    }

    applyRules() {

    }

    render() {
        return (
            <div className="ca-container">
                <canvas width="1000px" height="700px" ref={this.lSystemRef}/>
            </div>
            );
    }
}

export default LSystem;