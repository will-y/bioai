import React from "react";
import './NeuralNetwork.css';
import '../Page.css';

class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nn: {
                nodes: [
                    {x: 100, y: 100, id: 0, input: true},
                    {x: 100, y: 200, id: 1, input: true},
                    {x: 200, y: 150, id: 2, output: true}
                ],
                edges: [
                    {n1: 0, n2: 2, w: 1},
                    {n1: 1, n2: 2, w: 0.5}
                ]
            },
            width: 500,
            height: 500
        }

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.drawNeuralNetwork();
    }


    drawNeuralNetwork() {
        const nodes = this.state.nn.nodes;
        const edges = this.state.nn.edges;

        this.ctx.clearRect(0, 0, this.state.width, this.state.height);

        // draw edges
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const n1 = nodes[edge.n1];
            const n2 = nodes[edge.n2];

            this.ctx.beginPath();
            this.ctx.strokeStyle = 'orange';
            this.ctx.lineWidth = edge.w * 5;
            console.log(edge);
            this.ctx.moveTo(n1.x, n1.y);
            this.ctx.lineTo(n2.x, n2.y);
            this.ctx.stroke();
        }

        // draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            this.ctx.beginPath();
            this.ctx.fillStyle = 'purple';
            this.ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }

    }

    render() {
        return (
            <div className="container">
                <div className="row controls-container">
                    <button>Test</button>
                    <button>Test</button>
                    <button>Test</button>
                    <button>Test</button>

                </div>
                <div className="row nn-canvas-container">
                    <canvas width={this.state.width} height={this.state.height} ref={this.canvasRef}/>
                </div>
            </div>
        );
    }
}

export default NeuralNetwork;
