import React from "react";
import './NeuralNetwork.css';
import '../Page.css';
import Popover from "../common/Popover";
import { togglePopover} from "../common/PopoverUtilities";

const node_radius = 20;
const layer_size = 4;

class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nn: {
                nodes: {
                    0: {x: 100, y: 100, input: true, color: "#008000"},
                    1: {x: 100, y: 200, input: true, color: "#008000"},
                    2: {x: 200, y: 150, output: true, color: "#008000"}
                },
                edges: {
                    0: {n1: 0, n2: 2, w: 1, color: "#FFA500"},
                    1: {n1: 1, n2: 2, w: 0.5, color: "#FFA500"}
                },
                layers: {
                    0: {input: true, nodes: [0, 1]},
                    1: {output: true, nodes: [2]}
                }
            },
            width: 1000,
            height: 500,
            nodeSelected: false,
            selectedId: -1,
            selectedColor: "",
            selectedWeight: 0,
            edgeIdCounter: 2
        }

        this.canvasRef = React.createRef();
        this.popoverEnabled = false;
        this.layers = 0;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.colorChange = this.colorChange.bind(this);
        this.addLayer = this.addLayer.bind(this);
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
        return y1 === y2 ? Math.abs(py - y1) : Math.abs((x2 - x1) * (y1 - py) - (x1 - px) * (y2 - y1)) / (Math.sqrt((x2 - x2) ** 2 + (y2 - y1) ** 2));
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
        const name = event.target.name;
        let toReturn;

        this.setState((prevState) => {
            // const nn = Object.assign({}, prevState.nn);
            const nn = JSON.parse(JSON.stringify(prevState.nn))

            if (name === "color-selector") {
                if (this.state.nodeSelected) {
                    // nn.nodes[prevState.selectedObject.id].color = value;
                    nn.nodes[prevState.selectedId].color = value;

                } else {
                    // nn.edges[prevState.selectedObject.id].color = value;
                    nn.edges[prevState.selectedId].color = value;
                }
                toReturn = {
                    selectedColor: value,
                    nn: nn
                }
            } else if (name === "weight-selector") {
                if (!this.state.nodeSelected) {
                    // nn.edges[prevState.selectedObject.id].w = value;
                    nn.edges[prevState.selectedId].w = value;
                }
                toReturn = {
                    selectedWeight: value,
                    nn: nn
                }
            }

            return toReturn;
        }, () => {
            this.drawNeuralNetwork();
        });
    }

    detectClickNode(x, y) {
        const nodes = this.state.nn.nodes;

        for (const nodeId in nodes) {
            const node = nodes[nodeId];

            if (this.distance(node.x, node.y, x, y) <= node_radius) {
                return nodeId;
            }
        }
        return -1;
    }

    detectClickEdge(x, y) {
        const edges = this.state.nn.edges;
        const nodes = this.state.nn.nodes;

        for (const edgeId in edges) {
            const edge = edges[edgeId];
            const n1 = nodes[edge.n1];
            const n2 = nodes[edge.n2];

            const dist = this.distanceToLine(n1.x, n1.y, n2.x, n2.y, x, y);

            if (((n1.x < x && x < n2.x) || (n2.x < x && x < n1.x))
                && (dist <= edge.w * 10)) {
                return edgeId;
            }
        }
        return -1;
    }

    handleClickNode(id, isNode) {
        const toTogglePopover = this.popoverEnabled || this.state.selectedId === -1 || (id === this.state.selectedId && this.state.nodeSelected === isNode);

        this.setState((prevState) => {
            const selectedColor = isNode ? prevState.nn.nodes[id].color : prevState.nn.edges[id].color;
            const selectedWeight = isNode ? 0 : prevState.nn.edges[id].w;
            return {
                selectedId: id,
                nodeSelected: isNode,
                selectedColor: selectedColor,
                selectedWeight: selectedWeight
            }
        }, () => {
            if (toTogglePopover) {
                this.popoverEnabled = togglePopover("node-edge-info");
            }
        });
    }

    addLayer() {
        // TODO: Edge things

        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn))
            const startingId = Object.keys(nn.nodes).length;
            let tempCounter = prevState.edgeIdCounter;

            // move output nodes out and mark the ids of output nodes
            const outputIds = [];
            for (let i = 0; i < startingId; i++) {
                if (nn.nodes[i].output) {
                    nn.nodes[i].x += 100;
                    outputIds.push(i);
                }
            }

            // add new nodes
            const newNodeIds = [];
            for (let i = 0; i < layer_size; i++) {

                nn.nodes[startingId + i] = {x: 200 + 100 * this.layers, y: 20 + i * 80, color: "#00F000"};
                newNodeIds.push(startingId + i);
            }

            nn.layers[this.layers + 2] = {}
            nn.layers[this.layers + 2].nodes = newNodeIds;

            // remove edges connecting to output layer
            let removed = 0;

            const newEdges = {};

            for (const edgeId in nn.edges) {
                if (!outputIds.includes(nn.edges[edgeId].n2)) {
                    newEdges[edgeId] = nn.edges[edgeId];
                } else {
                    removed++;
                }
            }

            nn.edges = newEdges;

            // nn.edges = nn.edges.filter(edge => {
            //     return !outputIds.includes(edge.n2);
            // });

            tempCounter -= removed;

            // add edges from previous layer to the next layer
            if (this.layers === 0) {
                // if first layer, add to input layer, else add to previous layer
                for (let i = 0; i < nn.layers["0"].nodes.length; i++) {
                    for (let j = 0; j < newNodeIds.length; j++) {
                        nn.edges[tempCounter++] = {n1: nn.layers["0"].nodes[i], n2: newNodeIds[j], w: 1, color: "#FFA500"};
                    }
                }
            } else {
                for (let i = 0; i < nn.layers[this.layers + 1].nodes.length; i++) {
                    for (let j = 0; j < newNodeIds.length; j++) {
                        nn.edges[tempCounter++] = {n1: nn.layers[this.layers + 1].nodes[i], n2: newNodeIds[j], w: 1, color: "#FFA500"};
                    }
                }
            }

            return {nn: nn, edgeIdCounter: tempCounter};

        }, () => {

            this.drawNeuralNetwork();
            this.layers++;
        });
    }

    drawNeuralNetwork() {
        console.log(this.state.nn);
        const nodes = this.state.nn.nodes;
        const edges = this.state.nn.edges;

        this.ctx.clearRect(0, 0, this.state.width, this.state.height);

        // draw edges
        for (const id in edges) {
            const edge = edges[id];
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
        for (const id in nodes) {
            this.drawNode(id);
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
                        <button onClick={this.addLayer}>Add Layer</button>
                    </div>
                    <div className="row nn-canvas-container">
                        <canvas width={this.state.width} height={this.state.height} ref={this.canvasRef}
                                onClick={this.handleCanvasClick}/>
                    </div>
                </div>
                <Popover popoverId="node-edge-info">
                    <h2>{this.state.nodeSelected ? "Node" : "Edge"} Info</h2>
                    <p>ID: {this.state.selectedId}</p>
                    <label htmlFor="color-selector">Color: </label>
                    <input type="color" value={this.state.selectedColor} onChange={this.colorChange}
                           name="color-selector"/>
                    {this.state.nodeSelected ?
                        <div>
                            <label htmlFor="activation-function">Activation Function: </label>
                            <select name="activation-function">
                                <option>Tan</option>
                                <option>RELU</option>
                            </select>
                            <p>X: {this.state.nn.nodes[this.state.selectedId].x}</p>
                            <p>Y: {this.state.nn.nodes[this.state.selectedId].y}</p>
                        </div> :
                        <div>
                            <label htmlFor="weight-selector">Weight: </label>
                            <input name="weight-selector" type="number" value={this.state.selectedWeight} onChange={this.colorChange} step={0.1}/>
                        </div>}
                </Popover>
            </div>
        );
    }
}

export default NeuralNetwork;
