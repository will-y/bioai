import React from "react";
import './NeuralNetwork.css';
import '../Page.css';
import Popover from "../common/Popover";
import { togglePopover} from "../common/PopoverUtilities";

const node_radius = 20;

class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nn: {
                nodes: [
                    {x: 100, y: 100, id: 0, input: true, color: "#008000", node: true},
                    {x: 100, y: 200, id: 1, input: true, color: "#008000", node: true},
                    {x: 200, y: 150, id: 2, output: true, color: "#008000", node: true}
                ],
                edges: [
                    {n1: 0, n2: 2, w: 1, color: "#FFA500", id: 0, node: false},
                    {n1: 1, n2: 2, w: 0.5, color: "#FFA500", id: 1, node: false}
                ]
            },
            width: 500,
            height: 500,
            selectedObject: {},
            nodeSelected: false,
            selectedColor: ""
        }

        this.canvasRef = React.createRef();
        this.popoverEnabled = false;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.colorChange = this.colorChange.bind(this);
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
            this.handleClickNode(nodeClicked, true);
        } else {
            const edgeClicked = this.detectClickEdge(clickPos[0], clickPos[1]);
            if (edgeClicked !== -1) {
                this.handleClickNode(edgeClicked, false);
            }
        }
    }

    colorChange(event) {
        const value = event.target.value;
        this.setState((prevState) => {
            const nn = Object.assign({}, prevState.nn);
            if (this.state.nodeSelected) {
                nn.nodes[prevState.selectedObject.id].color = value;
            } else {
                nn.edges[prevState.selectedObject.id].color = value;
            }
            return {
                selectedColor: value,
                nn: nn
            }
        }, () => {
            this.drawNeuralNetwork();
        });
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

    handleClickNode(id, isNode) {
        console.log(`clicked ${isNode ? "node" : "edge"} id: ` + id);

        const toTogglePopover = this.popoverEnabled || Object.keys(this.state.selectedObject).length === 0 || (id === this.state.selectedObject.id && this.state.nodeSelected === isNode);

        this.setState((prevState) => {
            const selectedObject = isNode ? prevState.nn.nodes[id] : prevState.nn.edges[id];
            const selectedColor = isNode ? prevState.nn.nodes[id].color : prevState.nn.edges[id].color;
            return {
                selectedObject: selectedObject,
                nodeSelected: isNode,
                selectedColor: selectedColor,
            }
        }, () => {
            if (toTogglePopover) {
                this.popoverEnabled = togglePopover("node-edge-info");
            }
        });
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

            this.ctx.moveTo(n1.x, n1.y);
            this.ctx.lineTo(n2.x, n2.y);
            this.ctx.stroke();
        }

        // draw nodes
        for (let i = 0; i < nodes.length; i++) {
            this.drawNode(i);
        }
    }

    drawNode(nodeIndex) {
        const node = this.state.nn.nodes[nodeIndex];

        this.ctx.beginPath();
        this.ctx.fillStyle = node.color;
        this.ctx.arc(node.x, node.y, node_radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    render() {
        return (
            <div>
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
                <Popover popoverId="node-edge-info">
                    <h2>{this.state.nodeSelected ? "Node" : "Edge"} Info</h2>
                    <p>ID: {this.state.selectedObject.id}</p>
                    <input type="color" value={this.state.selectedColor} onChange={this.colorChange}/>
                </Popover>
            </div>
        );
    }
}

export default NeuralNetwork;
