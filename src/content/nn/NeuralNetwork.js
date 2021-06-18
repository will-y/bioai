import React from "react";
import './NeuralNetwork.css';
import '../Page.css';

const node_radius = 20;

class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nn: {
                nodes: [
                    {x: 100, y: 100, id: 0, input: true, color: "purple"},
                    {x: 100, y: 200, id: 1, input: true, color: "purple"},
                    {x: 200, y: 150, id: 2, output: true, color: "green"}
                ],
                edges: [
                    {n1: 0, n2: 2, w: 1, color: "orange"},
                    {n1: 1, n2: 2, w: 0.5, color: "orange"}
                ]
            },
            width: 500,
            height: 500
        }

        this.canvasRef = React.createRef();

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.drawNeuralNetwork();
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    // distance of point (px, py) from the line that passes through the points (x1, y1) and (x2, y2).
    distanceToLine(x1, y1, x2, y2, px, py) {
        return Math.abs((x2 - x1) * (y1 - py) - (x1 - px) * (y2 - y1)) / (Math.sqrt((x2 - x2) ** 2 + (y2 - y1) ** 2));
    }

    // got this from https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
    getMousePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        return [x, y];
    }

    handleCanvasClick(e) {
        const clickPos = this.getMousePosition(this.canvasRef.current, e);
        const nodeClicked = this.detectClickNode(clickPos[0], clickPos[1]);
        if (nodeClicked !== -1) {
            this.handleClickNode(nodeClicked);
        }

        const edgeClicked = this.detectClickEdge(clickPos[0], clickPos[1]);
        if (edgeClicked !== -1) {
            this.handleClickEdge(edgeClicked);
        }
    }

    detectClickNode(x, y) {
        const nodes = this.state.nn.nodes;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (this.distance(node.x, node.y, x, y) <= node_radius) {
                return i;
            }
        }

        return -1;
    }

    detectClickEdge(x, y) {
        const edges = this.state.nn.edges;
        const nodes = this.state.nn.nodes;

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const n1 = nodes[edge.n1];
            const n2 = nodes[edge.n2];

            if (((n1.x < x && x < n2.x) || (n2.x < x && x < n1.x))
                && ((n1.y < y && y < n2.y) || (n2.y < y && y < n1.y))
                && this.distanceToLine(n1.x, n1.y, n2.x, n2.y, x, y) <= edge.w * 10) {
                return i;
            }
        }
        return -1;
    }

    handleClickNode(node) {
        console.log('clicked node id: ' + node)
    }

    handleClickEdge(edge) {
        console.log('clicked edge id: ' + edge)
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
            this.ctx.strokeStyle = edge.color;
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
            this.ctx.fillStyle = node.color;
            this.ctx.arc(node.x, node.y, node_radius, 0, Math.PI * 2);
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
                    <canvas width={this.state.width} height={this.state.height} ref={this.canvasRef} onClick={this.handleCanvasClick}/>
                </div>
            </div>
        );
    }
}

export default NeuralNetwork;
