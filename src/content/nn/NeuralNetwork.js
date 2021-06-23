import React from "react";
import './NeuralNetwork.css';
import '../Page.css';
import Popover from "../common/Popover";
import {disablePopover, togglePopover} from "../common/PopoverUtilities";

const node_radius = 20;
const max_node_difference = 200;
const node_x_spacing = 150;
const starting_x = 50;
const node_default_color = "#008000";
const edge_default_color = "#FFA500";
const popover_id = "node-edge-info";
// use this: https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/
const activation_functions = ["Binary Step", "Linear", "Sigmoid", "Tanh", "ReLU", "Swish", "Softmax"];

class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 1000,
            height: 500,
            nodeSelected: false,
            selectedId: -1,
            selectedColor: "",
            selectedWeight: 0,
            selectedActivationFunction: -1,
            edgeIdCounter: 2,
            nodeIdCounter: 3
        }

        this.canvasRef = React.createRef();
        this.popoverEnabled = false;
        this.layers = 0;
        this.layerSize = 4;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.colorChange = this.colorChange.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.addInputNode = this.addInputNode.bind(this);
        this.removeInputNode = this.removeInputNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.addOutputNode = this.addOutputNode.bind(this);
        this.removeOutputNode = this.removeOutputNode.bind(this);
    }

    initializeNetwork(callback) {
        this.setState(() => {
            const nn = {
                nodes: {},
                edges: {
                    0: {n1: 0, n2: 2, w: Math.random(), color: edge_default_color},
                    1: {n1: 1, n2: 2, w: Math.random(), color: edge_default_color}
                },
                layers: {
                    0: {input: true, nodes: [0, 1]},
                    1: {output: true, nodes: [2]}
                }
            };
            const yValues = this.calculateNodeYValues(2);

            nn.nodes = {
                0: {x: starting_x, y: yValues[0], input: true, color: node_default_color, activationFunction: activation_functions[0]},
                1: {x: starting_x, y: yValues[1], input: true, color: node_default_color, activationFunction: activation_functions[0]},
                2: {x: starting_x + node_x_spacing, y: this.calculateNodeYValues(1)[0], output: true, color: node_default_color, activationFunction: activation_functions[0]}
            }

            return {nn: nn};
        }, callback);
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.initializeNetwork(this.drawNeuralNetwork);
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
            const nn = JSON.parse(JSON.stringify(prevState.nn))

            if (name === "color-selector") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].color = value;
                } else {
                    nn.edges[prevState.selectedId].color = value;
                }
                toReturn = {
                    selectedColor: value,
                    nn: nn
                }
            } else if (name === "weight-selector") {
                if (!this.state.nodeSelected) {
                    nn.edges[prevState.selectedId].w = value;
                }
                toReturn = {
                    selectedWeight: value,
                    nn: nn
                }
            } else if (name === "activation-selector") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].activationFunction = value;
                }
                toReturn = {
                    selectedActivationFunction: value,
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
                && (dist <= 5)) {
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
            const selectedActivationFunction = isNode ? prevState.nn.nodes[id].activationFunction : -1;

            return {
                selectedId: id,
                nodeSelected: isNode,
                selectedColor: selectedColor,
                selectedWeight: selectedWeight,
                selectedActivationFunction: selectedActivationFunction
            }
        }, () => {
            if (toTogglePopover) {
                this.popoverEnabled = togglePopover(popover_id);
            }
        });
    }

    addLayer() {
        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));
            let startingId = this.state.nodeIdCounter;
            let tempCounter = prevState.edgeIdCounter;

            // move output nodes out and mark the ids of output nodes
            const outputIds = [];
            for (let i = 0; i < startingId; i++) {
                if (nn.nodes[i] && nn.nodes[i].output) {
                    nn.nodes[i].x += node_x_spacing;
                    outputIds.push(i);
                }
            }

            // add new nodes
            const newNodeIds = [];
            const yValues = this.calculateNodeYValues(this.layerSize);
            for (let i = 0; i < this.layerSize; i++) {

                nn.nodes[startingId++] = {x: starting_x + node_x_spacing * (this.layers + 1), y: yValues[i], color: node_default_color};
                newNodeIds.push(startingId - 1);
            }

            nn.layers[this.layers + 2] = {}
            nn.layers[this.layers + 2].nodes = newNodeIds;

            // remove edges connecting to output layer
            const newEdges = {};

            for (const edgeId in nn.edges) {
                if (!outputIds.includes(nn.edges[edgeId].n2)) {
                    newEdges[edgeId] = nn.edges[edgeId];
                }
            }

            nn.edges = newEdges;

            // add edges from previous layer to the next layer
            if (this.layers === 0) {
                // if first layer, add to input layer, else add to previous layer
                tempCounter = this.connectLayers(0, this.layers + 2, nn, tempCounter);
            } else {
                tempCounter = this.connectLayers(this.layers + 1, this.layers + 2, nn, tempCounter);
            }

            // add edges from the new layer to the output layer
            tempCounter = this.connectLayers(this.layers + 2, 1, nn, tempCounter);

            return {nn: nn, edgeIdCounter: tempCounter, nodeIdCounter: startingId};

        }, () => {
            this.drawNeuralNetwork();
            this.layers++;
        });
    }

    addNode(layer) {
        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));
            const id = prevState.nodeIdCounter;
            const nodeIds = nn.layers[layer].nodes;
            const layerIndex = nodeIds.length;
            const yValues = this.calculateNodeYValues(layerIndex + 1);
            const xValue = nn.nodes[nn.layers[layer].nodes[0]].x;
            const nextLayerIds = (() => {
                // if starting layer and no layers, output layer
                // if starting layer and layers, layer 2
                // if other layer and layer + 1 exists, layer + 1
                // else output layer
                if (layer === 0) {
                    if (this.layers === 0) {
                        return nn.layers[1].nodes
                    } else {
                        return nn.layers[2].nodes
                    }
                } else if (layer === 1) {
                    if (this.layers === 0) {
                        return nn.layers[0].nodes;
                    } else {
                        return nn.layers[this.layers + 1];
                    }
                } else {
                    if (nn.layers[layer + 1]) {
                        return nn.layers[layer + 1]
                    } else {
                        return nn.layers[1].nodes
                    }
                }
            })();

            let nextEdge = prevState.edgeIdCounter;

            nn.nodes[id] = {x: xValue, y: yValues[layerIndex], input: true, color: node_default_color};

            nodeIds.forEach((element, index) => {
                nn.nodes[element].y = yValues[index];
            });

            nn.layers[layer].nodes.push(id);

            nextLayerIds.forEach(element => {
                if (layer === 1) {
                    nn.edges[nextEdge++] = {n1: element, n2: id, color: edge_default_color, w: Math.random()};
                } else {
                    nn.edges[nextEdge++] = {n1: id, n2: element, color: edge_default_color, w: Math.random()};
                }
            });

            return {nn: nn, edgeIdCounter: nextEdge, nodeIdCounter: id + 1};
        }, this.drawNeuralNetwork);
    }

    addInputNode() {
        this.addNode(0);
    }

    addOutputNode() {
        this.addNode(1);
    }

    removeInputNode() {
        const toRemove = this.state.nn.layers[0].nodes[this.state.nn.layers[0].nodes.length - 1];
        this.removeNode(toRemove);
    }

    removeOutputNode() {
        const toRemove = this.state.nn.layers[1].nodes[this.state.nn.layers[1].nodes.length - 1];
        this.removeNode(toRemove);
    }

    removeNode(id) {
        let deletedLayer = false;
        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));
            const layer = this.findLayer(id, prevState);
            let edgeCounter = prevState.edgeIdCounter;

            if (nn.layers[layer].nodes.length === 1) {
                if (nn.layers[layer].output || nn.layers[layer].input) {
                    alert("Cannot delete last node in input or output layer");
                    return {};
                } else {
                    // things for if last node in layer
                    delete nn.layers[layer];
                    deletedLayer = true;
                    for (let i = 0; i < this.layers + 2; i++) {
                        if (nn.layers[i] && !nn.layers[i].input && !nn.layers[i].output && i > layer) {
                            nn.layers[i - 1] = nn.layers[i];
                            // move other layers in
                            nn.layers[i - 1].nodes.forEach(element => {
                                nn.nodes[element].x -= node_x_spacing;
                            });
                        }
                    }

                    // move output layer in
                    nn.layers[1].nodes.forEach(element => {
                       nn.nodes[element].x -= node_x_spacing;
                    });

                    // add connections between two layers surrounding removed one (itself and -1 normally)
                    if (this.layers === 1) {
                        // all layers gone connect input and output
                        edgeCounter = this.connectLayers(0, 1, nn, prevState.edgeIdCounter);
                    } else {
                        const layerToConnect = nn.layers[layer] ? layer : 1;
                        const layerToStart = (layer - 1) === 1 ? 0 : layer - 1;
                        edgeCounter = this.connectLayers(layerToStart, layerToConnect, nn, prevState.edgeIdCounter);
                    }
                }
            }

            delete nn.nodes[id];
            if (!deletedLayer) {
                // things for if not last node in layer
                nn.layers[layer].nodes = nn.layers[layer].nodes.filter(element => element !== id);

                // reposition nodes in layer
                const yValues = this.calculateNodeYValues(nn.layers[layer].nodes.length);

                nn.layers[layer].nodes.forEach((element, index) => {
                    nn.nodes[element].y = yValues[index];
                });
            }

            // things for all cases
            // delete edges into and out of the deleted node
            for (const edgeId in nn.edges) {
                if (nn.edges[edgeId].n1 === id || nn.edges[edgeId].n2 === id) {
                    delete nn.edges[edgeId];
                }
            }

            disablePopover(popover_id);
            this.popoverEnabled = false;

            return {
                nn: nn,
                selectedId: -1,
                edgeIdCounter: edgeCounter
            };
        }, () => {
            this.drawNeuralNetwork();
            if (deletedLayer) {
                this.layers--;
            }
        });
    }

    // Connects two layers, modifies the nn object passed in, pass in the current edge ID counter
    // returns the new edge counter (to be updated in setState where this should be called)
    connectLayers(layer1, layer2, nn, initialEdgeCounter) {
        let edgeCounter = parseInt(initialEdgeCounter);

        nn.layers[layer1].nodes.forEach(layer1Node => {
            nn.layers[layer2].nodes.forEach(layer2Node => {
                nn.edges[edgeCounter++] = {n1: layer1Node, n2: layer2Node, w: Math.random(), color: edge_default_color}
            });
        });

        return edgeCounter;
    }

    findLayer(nodeId, state) {
        for (const layerId in state.nn.layers) {
            if (state.nn.layers[layerId].nodes.includes(nodeId)) {
                return layerId;
            }
        }

        return -1;
    }

    drawNeuralNetwork() {
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

    calculateNodeYValues(numNodes) {
        const height = this.state.height;
        const result = [];

        let space = height / (numNodes + 1);

        if (space > max_node_difference && numNodes > 1) {
            space = max_node_difference;
            const leftOver = height - space * (numNodes + 1);
            for (let i = 0; i < numNodes; i++) {
                result.push(leftOver / 2 + space * i)
            }
        } else {
            for (let i = 0; i < numNodes; i++) {
                result.push(space * (i + 1));
            }
        }

        return result;

    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row controls-container">
                        <button onClick={this.addLayer}>Add Layer</button>
                        <button onClick={this.removeInputNode}>-</button>
                        <label>Input</label>
                        <button onClick={this.addInputNode}>+</button>
                        <button onClick={this.removeOutputNode}>-</button>
                        <label>Output</label>
                        <button onClick={this.addOutputNode}>+</button>
                    </div>
                    <div className="row nn-canvas-container">
                        <canvas width={this.state.width} height={this.state.height} ref={this.canvasRef}
                                onClick={this.handleCanvasClick} className="canvas-outline"/>
                    </div>
                </div>
                <Popover popoverId={popover_id}>
                    <h2>{this.state.nodeSelected ? "Node" : "Edge"} Info</h2>
                    <p>ID: {this.state.selectedId}</p>
                    <label htmlFor="color-selector">Color: </label>
                    <input type="color" value={this.state.selectedColor} onChange={this.colorChange}
                           name="color-selector"/>
                    {this.state.nodeSelected ?
                        <div>
                            <label htmlFor="activation-function">Activation Function: </label>
                            <select name="activation-selector" value={this.state.selectedActivationFunction} onChange={this.colorChange}>
                                {activation_functions.map((fn, index) => {
                                    return <option id={index} key={fn}>{fn}</option>;
                                })}
                            </select>
                            {this.state.selectedId !== -1 &&
                                <div>
                                    <p>X: {this.state.nn.nodes[this.state.selectedId].x}</p>
                                    <p>Y: {this.state.nn.nodes[this.state.selectedId].y}</p>
                                </div>
                            }
                            <button className="btn btn-danger" onClick={() => this.removeNode(parseInt(this.state.selectedId))}>Delete</button>
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
