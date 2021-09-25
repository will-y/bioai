import React from "react";
import './NeuralNetwork.css';
import '../Page.css';
import Popover from "../common/Popover";
import {disablePopover, togglePopover} from "../common/PopoverUtilities";

const node_radius = 20;
const selection_outline_radius = 2;
const max_node_difference = 200;
const node_x_spacing = 150;
const starting_x = 50;
const node_default_color = "#4361A1";
const edge_default_color = "#4afd06";
const edge_negative_default_color = "#ef0202";
const outline_color = "#000000";

const popover_id = "node-edge-info";
// use this: https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/
const activation_functions_list = ["None", "Binary Step", "Linear", "Sigmoid", "Tanh", "ReLU", "Leaky ReLU", "ELU", "Swish"];

// activation functions that require a parameter
const parameterized_activation_functions = ["Linear", "ELU"];

const activation_functions = {
    "None": x => x,
    "Binary Step": x => x >= 0 ? 1 : 0,
    "Linear": (x, a) => a*x,
    "Sigmoid": x => 1 / (1 + Math.exp(-x)),
    "Tanh": x => 2 / (1 + Math.exp(-2 * x)) - 1,
    "ReLU": x => Math.max(0, x),
    "Leaky ReLU": x => x > 0 ? x : 0.1 * x,
    "ELU": (x, a) => x < 0 ? a * (Math.exp(x) - 1) : x,
    "Swish": x => x / (1 + Math.exp(-x))
}


// TODO: Add bias to the nodes with an input similar to the edge weights and apply them to the calculations

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
            nodeIdCounter: 3,
            layerSize: 4,
            node0Input: 0,
            node1Input: 0,
            activationParameter: 0,
            selectedBias: 0
        }

        this.canvasRef = React.createRef();
        this.popoverEnabled = false;
        this.layers = 0;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addLayer = this.addLayer.bind(this);
        this.addInputNode = this.addInputNode.bind(this);
        this.removeInputNode = this.removeInputNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.addOutputNode = this.addOutputNode.bind(this);
        this.removeOutputNode = this.removeOutputNode.bind(this);
    }

    initializeNetwork(callback) {
        this.setState(() => {
            const w1 = this.getRandomWeight();
            const w2 = this.getRandomWeight();

            const nn = {
                nodes: {},
                edges: {
                    0: {n1: 0, n2: 2, l: 0, w: w1, color: w1 > 0 ? edge_default_color : edge_negative_default_color},
                    1: {n1: 1, n2: 2, l: 0, w: w2, color: w2 > 0 ? edge_default_color : edge_negative_default_color}
                },
                layers: {
                    0: {input: true, nodes: [0, 1]},
                    1: {output: true, nodes: [2]}
                }
            };
            const yValues = this.calculateNodeYValues(2);

            nn.nodes = {
                0: {x: starting_x, y: yValues[0], input: true, color: node_default_color, activationFunction: activation_functions_list[0], value: 0, activationParameter: 0},
                1: {x: starting_x, y: yValues[1], input: true, color: node_default_color, activationFunction: activation_functions_list[0], value: 0, activationParameter: 0},
                2: {x: starting_x + node_x_spacing, y: this.calculateNodeYValues(1)[0], output: true, color: node_default_color, activationFunction: activation_functions_list[0], value: 0,  activationParameter: 0, bias: 0}
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
            this.handleClickObject(nodeClicked, true);
        } else {
            const edgeClicked = this.detectClickEdge(clickPos[0], clickPos[1]);
            if (edgeClicked !== -1) {
                this.handleClickObject(edgeClicked, false);
            }
        }
    }

    // TODO this could use some cleanup
    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let toReturn;
        let layerToUpdate = -1;

        this.setState((prevState) => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));

            if (name === "color-selector") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].color = value;
                } else {
                    nn.edges[prevState.selectedId].color = value;
                }
                toReturn = {
                    selectedColor: value,
                    nn: nn
                };
            } else if (name === "weight-selector") {
                if (!prevState.nodeSelected) {
                    nn.edges[prevState.selectedId].w = value;
                    layerToUpdate = this.layers === 0 ? 1 : nn.edges[prevState.selectedId].l + 1;
                }
                toReturn = {
                    selectedWeight: value,
                    nn: nn
                };
            } else if (name === "activation-selector") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].activationFunction = value;
                    layerToUpdate = this.layers === 0 ? 1 : 2;
                }
                toReturn = {
                    selectedActivationFunction: value,
                    nn: nn
                };
            } else if (name === "activation-parameter") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].activationParameter = parseFloat(value);
                    layerToUpdate = this.layers === 0 ? 1 : 2;
                }

                toReturn = {
                    activationParameter: value,
                    nn: nn
                }

            } else if (name === "bias") {
                if (this.state.nodeSelected) {
                    nn.nodes[prevState.selectedId].bias = parseFloat(value);
                    layerToUpdate = this.layers === 0 ? 1 : 2;
                }

                toReturn = {
                    selectedBias: value,
                    nn: nn
                }
            } else {
                if (name.includes("node")) {
                    const nodeId = parseInt(event.target.id);
                    nn.nodes[nodeId].value = parseFloat(value);

                    layerToUpdate = this.layers === 0 ? 1 : 2;
                }

                toReturn = {
                    [name]: value,
                    nn: nn
                };
            }

            if (layerToUpdate !== -1) {
                this.updateOutput(nn.layers[layerToUpdate] ? layerToUpdate: 0, nn);
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
                && (dist <= 10)) {
                return edgeId;
            }
        }
        return -1;
    }

    handleClickObject(id, isNode) {
        const toTogglePopover = this.popoverEnabled || this.state.selectedId === -1 || (id === this.state.selectedId && this.state.nodeSelected === isNode);

        this.setState((prevState) => {
            const selectedColor = isNode ? prevState.nn.nodes[id].color : prevState.nn.edges[id].color;
            const selectedWeight = isNode ? 0 : prevState.nn.edges[id].w;
            const selectedActivationFunction = isNode ? prevState.nn.nodes[id].activationFunction : -1;
            const selectedActivationParameter = isNode ? prevState.nn.nodes[id].activationParameter : -1;
            const selectedBias = isNode ? prevState.nn.nodes[id].bias : -1;

            return {
                selectedId: id,
                nodeSelected: isNode,
                selectedColor: selectedColor,
                selectedWeight: selectedWeight,
                selectedActivationFunction: selectedActivationFunction,
                activationParameter: selectedActivationParameter,
                selectedBias: selectedBias
            }
        }, () => {
            if (toTogglePopover) {
                this.popoverEnabled = togglePopover(popover_id);
            }
            this.drawNeuralNetwork();
        });
    }

    addLayer() {
        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));
            let startingId = this.state.nodeIdCounter;
            let tempCounter = prevState.edgeIdCounter;

            // move output nodes out and mark the ids of output nodes
            const outputIds = nn.layers[1].nodes;

            outputIds.forEach(element => {
                nn.nodes[element].x += node_x_spacing;
            });

            // add new nodes
            const newNodeIds = [];
            const yValues = this.calculateNodeYValues(this.state.layerSize);
            for (let i = 0; i < this.state.layerSize; i++) {
                nn.nodes[startingId++] = {x: starting_x + node_x_spacing * (this.layers + 1), y: yValues[i], color: node_default_color, activationFunction: activation_functions_list[0], activationParameter: 0, bias: 0};
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

            this.updateOutput(this.layers + 2, nn);

            return {nn: nn, edgeIdCounter: tempCounter, nodeIdCounter: startingId};

        }, () => {
            this.drawNeuralNetwork();
            this.layers++;
        });
    }

    addNode(layer, extraStates={}, updateOutput=false) {
        this.setState(prevState => {
            const nn = JSON.parse(JSON.stringify(prevState.nn));
            const id = prevState.nodeIdCounter;
            const nodeIds = nn.layers[layer].nodes;
            const layerIndex = nodeIds.length;
            const yValues = this.calculateNodeYValues(layerIndex + 1);
            const xValue = nn.nodes[nn.layers[layer].nodes[0]].x;
            const nextLayerIds = nn.layers[this.getNextLayer(layer, nn)].nodes;

            let nextEdge = prevState.edgeIdCounter;

            nn.nodes[id] = {x: xValue, y: yValues[layerIndex], input: layer === 0, color: node_default_color, value: 0, activationFunction: activation_functions_list[0], activationParameter: 0, bias: 0};

            nodeIds.forEach((element, index) => {
                nn.nodes[element].y = yValues[index];
            });

            nn.layers[layer].nodes.push(id);

            nextLayerIds.forEach(element => {
                if (layer === 1) {
                    nn.edges[nextEdge++] = {n1: element, n2: id, l: layer, color: edge_default_color, w: this.getRandomWeight()};
                } else {
                    nn.edges[nextEdge++] = {n1: id, n2: element, l: layer, color: edge_default_color, w: this.getRandomWeight()};
                }
            });

            if (updateOutput) {
                this.updateOutput(layer, nn);
            }

            return {nn: nn, edgeIdCounter: nextEdge, nodeIdCounter: id + 1, ...extraStates};
        }, this.drawNeuralNetwork);
    }

    getNextLayer(currentLayer, nn) {
        // if starting layer and no layers, output layer
        // if starting layer and layers, layer 2
        // if other layer and layer + 1 exists, layer + 1
        // else output layer
        if (currentLayer === 0) {
            if (this.layers === 0) {
                return 1;
            } else {
                return 2;
            }
        } else if (currentLayer === 1) {
            if (this.layers === 0) {
                return 0;
            } else {
                return this.layers + 1;
            }
        } else {
            if (nn.layers[currentLayer + 1]) {
                return currentLayer + 1;
            } else {
                return 1;
            }
        }
    }

    addInputNode() {
        const id = this.state.nodeIdCounter;
        this.addNode(0, {[`node${id}Input`]: 0}, true);
    }

    addOutputNode() {
        this.addNode(1, {}, true);
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

            if (prevState.selectedId && parseInt(prevState.selectedId) === id) {
                disablePopover(popover_id);
                this.popoverEnabled = false;
            }

            this.updateOutput(layer, nn);

            return {
                nn: nn,
                selectedId: parseInt(prevState.selectedId) === id ? -1 : parseInt(prevState.selectedId),
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
                const weight = this.getRandomWeight();
                nn.edges[edgeCounter++] = {n1: layer1Node, n2: layer2Node, l: layer1, w: weight, color: weight >= 0 ? edge_default_color : edge_negative_default_color}
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



            // if it is selected, outline it
            if (!this.state.nodeSelected && id === this.state.selectedId) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = outline_color;
                this.ctx.lineWidth = Math.abs(edge.w) * 5 + selection_outline_radius * 2;

                this.ctx.moveTo(n1.x, n1.y);
                this.ctx.lineTo(n2.x, n2.y);

                this.ctx.stroke();
            }

            this.ctx.beginPath();

            this.ctx.strokeStyle = edge.color;
            this.ctx.lineWidth = Math.abs(edge.w) * 5;

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

        // draw outline to indicate that this node is selected
        if (this.state.nodeSelected && this.state.selectedId === nodeIndex) {
            this.ctx.beginPath();
            this.ctx.fillStyle = outline_color;
            this.ctx.arc(node.x, node.y, node_radius + selection_outline_radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // draw node
        this.ctx.beginPath();
        this.ctx.fillStyle = node.color;
        this.ctx.arc(node.x, node.y, node_radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    calculateNodeYValues(numNodes) {
        numNodes = parseInt(numNodes);
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

    getRandomWeight() {
        return this.round(Math.random() * 2 - 1, 3);
    }

    /*
    updates all of the nodes
    the first layer to be updated should be passed in startingLayer
    nn will be updated to the correct values
     */
    updateOutput(startingLayer, nn) {
        // really gotta do something about this string number bs
        if (startingLayer !== 0 && startingLayer !== "0") {
            nn.layers[startingLayer].nodes.forEach(node => {
                let newValue = 0;

                Object.values(nn.edges).forEach(edge => {
                    if (edge.n2 === node) {
                        newValue += nn.nodes[edge.n1].value * edge.w;
                    }
                });

                nn.nodes[node].value = this.applyActivationFunction(nn.nodes[node].activationFunction, newValue, nn.nodes[node].activationParameter) + nn.nodes[node].bias;
            });
        }

        if (startingLayer !== 1) {
            const layer = this.getNextLayer(startingLayer, nn);
            this.updateOutput(layer, nn);
        }
    }

    applyActivationFunction(activationFunction, value, parameter) {
        const func = activation_functions[activationFunction];

        // just default to no activation function
        if (!func) {
            console.error("bad activation function: " + activationFunction);
            return value
        }

        if (parameterized_activation_functions.includes(activationFunction)) {
            return func(value, parameter);
        } else {
            return func(value);
        }
    }

    round(num, decimals) {
        return Math.round((num + Number.EPSILON) * 10**decimals) / 10**decimals;
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <p className="note-text">This page is not completely done, some things might not work.</p>
                    </div>
                    <div className="row controls-container">
                        <button onClick={this.addLayer}>Add Layer</button>
                        <label htmlFor="layerSize">Layer Size</label>
                        <input type="number"
                               name="layerSize"
                               size={3}
                               max={99}
                               min={1}
                               value={this.state.layerSize}
                               onChange={this.handleInputChange}/>
                        <button onClick={this.removeInputNode}>-</button>
                        <label>Input</label>
                        <button onClick={this.addInputNode}>+</button>
                        <button onClick={this.removeOutputNode}>-</button>
                        <label>Output</label>
                        <button onClick={this.addOutputNode}>+</button>
                    </div>
                    {this.state.nn &&
                    <div className="row controls-container">
                        <label className="input-label">Input:</label>
                        {this.state.nn.layers[0].nodes.map(nodeId => {
                            return <input key={nodeId}
                                          id={nodeId}
                                          type="number"
                                          step={0.01}
                                          size={6}
                                          name={`node${nodeId}Input`}
                                          onChange={this.handleInputChange}
                                          value={this.state[`node${nodeId}Input`]} />
                        })}
                        <label>Output:</label>
                        {this.state.nn.layers[1].nodes.map(nodeId => {
                            return <div key={nodeId} className="output-value">{this.round(this.state.nn.nodes[nodeId].value, 3)}</div>
                        })}
                    </div>}
                    <div className="row nn-canvas-container">
                        <canvas width={this.state.width} height={this.state.height} ref={this.canvasRef}
                                onClick={this.handleCanvasClick} className="canvas-outline"/>
                    </div>
                </div>
                <Popover popoverId={popover_id}>
                    <h2>{this.state.nodeSelected ? "Node" : "Edge"} Info</h2>
                    <p>ID: {this.state.selectedId}</p>
                    <label htmlFor="color-selector">Color: </label>
                    <input type="color" value={this.state.selectedColor} onChange={this.handleInputChange}
                           name="color-selector"/>
                    {this.state.nodeSelected ?
                        <div>
                            <label htmlFor="activation-function">Activation Function: </label>
                            <select name="activation-selector" value={this.state.selectedActivationFunction} onChange={this.handleInputChange}>
                                {activation_functions_list.map((fn, index) => {
                                    return <option id={index} key={fn}>{fn}</option>;
                                })}
                            </select>
                            {parameterized_activation_functions.includes(this.state.selectedActivationFunction) &&
                                <input name="activation-parameter" type="number" value={this.state.activationParameter} onChange={this.handleInputChange} step={0.001} />
                            }
                            {!this.state.nn.nodes[this.state.selectedId].input &&
                                <div>
                                    <label htmlFor="bias">Bias: </label>
                                    <input name="bias" type="number" value={this.state.selectedBias} onChange={this.handleInputChange} step={0.01} />
                                </div>
                            }
                            {this.state.selectedId !== -1 &&
                                <div>
                                    <p>X: {this.state.nn.nodes[this.state.selectedId].x}</p>
                                    <p>Y: {this.state.nn.nodes[this.state.selectedId].y}</p>
                                    <p>Value: {this.round(this.state.nn.nodes[this.state.selectedId].value, 3)}</p>
                                </div>
                            }
                            <button className="btn btn-danger" onClick={() => this.removeNode(parseInt(this.state.selectedId))}>Delete</button>
                        </div> :
                        <div>
                            <label htmlFor="weight-selector">Weight: </label>
                            <input name="weight-selector" type="number" value={this.state.selectedWeight} onChange={this.handleInputChange} step={0.001}/>
                        </div>}
                </Popover>
            </div>
        );
    }
}

export default NeuralNetwork;
