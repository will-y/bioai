# Biologically Inspired Artificial Intelligence Demo Application

## About

This is a collection of interactive demos of concepts related to bio-inspired artificial intelligence. Some of these apps were created as homework assignments I did during a class on this topic, and some of them are extensions or new things. The goal of this is to show some cool visualizations as well as provide some information about how these things work.

This was made using [React](https://reactjs.org/), and it is hosted through [Firebase](https://firebase.google.com/). The demos themselves are just drawings on [JavaScript Canvases](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). If you want to see the live version, you can find it [here](https://bioai.willyelton.dev).

## Demos

This section gives some basic information about each of the demo apps that are currently implemented. Some of the information here is also displayed in the app in info tabs.

### Common

Each of the apps will have an info button that will show an information panel that will show basic information about the app you are on including: background on the topic, how to use the app, and some links where you can find more information about the topic if you are interested.

### One Dimensional Cellular Automata

#### Background

Every iteration (row of squares) each square is updated based on the three squares above it. The transition rule is encoded into an 8-bit number. This transition rule is shown at the top of the app, the three squares on top are inputs on the previous row and the bottom square represents whether the new square will be on or off. More information about the transition function and one dimensional cellular automata in general, check out this [link](https://mathworld.wolfram.com/ElementaryCellularAutomaton.html).

#### How to Use the App

1. Select a transition function. When you update the transition function in the inout, the transition function diagram at the top will automatically change.
2. Click the `Start` button to create an initial state and clear the output. If the randomized option is checked, it will give you a random starting state.
3. Clicking `Play` will keep creating new states on a timer. The speed of the timer can be controlled with the slider.
4. You can also use the arrows next to the play button in order to step the simulation forwards and backwards.

### Conway's Game of Life

#### Background

Every cell on the board is either alive (green) or dead (white). A cell's neighbors are the eight cells around it. Each step in the simulation each cell is updated with the following rules:

- Any alive cell with 2 or 3 alive neighbors survives
- Any dead cell with exactly 3 alive neighbors turns alive
- All other alive cells die and other dead cells stay dead

For more information check [here](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

#### How to Use the App

1. Click the `Create Random State` button to generate a random board.
2. Press `stsrt` to begin the simulation.
3. `Step` goes forward one step in the simulation.
4. `Reset` clears the board.
5. The speed slider changes how fast the steps happen in the simulation.
6. Select a preset and then click `Load Preset` to check out some simple patters.

At any time you can also click on any square to toggle its state between alive and dead.

### Maze Solver Using Cellular Automata

#### Background

This is a simple program to solve mazes using cellular automata. There are three different state: path, wall, and start/end. The transition rules are the following:

1. Start/End states always remain Start/End states.
2. Wall states always remain wall states.
3. A path state turns into a wall state if it has exactly one wall neighbor.

The result of these transition rules is for the dead ends of the maze to be "eaten" away, and you are left with the solution.

#### Maze Generation

I didn't write the code for generating mazes. The point of this app is to solve them not create them. The source for the generation is [here](https://www.the-art-of-web.com/javascript/maze-generator/). There is a good article there explaining how it works. I slightly modified the original code in order to visualize it how I wanted and access the maze data.

#### How to Use the App

1. A random maze is automatically generated
2. Press `Run Maze Solver` to start solving the maze.
3. Or press the 'Step' button at any point to advance it one step.
4. To start over and generate a new maze press the `Reset` button.
5. The speed slider controls the speed of the simulation.

### L Systems

#### Background

An L-System is a series of rules to modify an initial string (axiom). Each iteration, each character is replaced with another sequence of characters defined by the transition rules. More information can be found [here](https://en.wikipedia.org/wiki/L-system).

#### How it Draws

All an L-System does is generate a string based on the axiom and the transition rules. This program then takes this string and draws it using [turtle graphics](https://en.wikipedia.org/wiki/Turtle_graphics) and the following rules:
- '-' Rotate Left
- '+' Rotate Right
- '[' Push the current position and rotation on the stack
- ']' Pop from the stack and set the position and rotation
- else Move forward one step

#### How to Use the App

When any setting is changed, the drawing on the right will update in real time.

##### Rules

By default, a ruleset for making binary trees is inputted. In order to make custom rules, first input an axiom. Then input any number of rules. The first character is what will be replaced, the second box can be any number of characters to replace it with. If you need more rules, click the Add Rule button.

##### Settings

###### Iterations [1-10]

This determines how many times the rules are applied to the string. (Note: it is capped at 10 because going higher starts to lag the drawing.)

###### X/Y Start

These determine the place on the canvas where the drawing starts.

###### Distance[1-200]

Determines the distance that is drawn forward.

###### Rotation Angle [0-2π]

Determines the angle (in radians) that the turtle rotates on a '-' or '+'.

### Boids

#### Background

Boids model a swarm of birds or other animals. Each boid's behavior (velocity) is determined by certain rules that have to do with other boids in its area. More information can be found [here](https://en.wikipedia.org/wiki/Boids).

#### Rules

Rule 1: Boids try to go towards the center of mass of the flock.

Rule 2: Boids try to stay away from other nearby boids.

Rule 3: Boids try to match the speed of other nearby boids.

Rule 4: Boids try to stay on the screen.

Rule 5: Boids are attracted to the blue circle.

Rule 6: Boids are afraid of the red predator.

#### How to Use the App

Press start to `start` the boids moving. Press it again to pause. Press `reset` to clear the attractor and the predator and reset the boids to random positions. Any of the settings will cause the simulation to update in real time.

##### Settings

###### Radius [1-20]
Controls the size of the boids.

###### Repel [0-200]
Determines the amount that the boids want stay away from each other.

###### Speed Limit [0-200]
Controls the max speed that the boids can travel.

###### CoM Attraction [1-200]
Controls how much the boids try to stay together.

###### Predator?
If checked, a red predator will appear and chase the boids.

### Neural Networks

#### Background

WIP

#### How to Use the App

##### Network Architecture

- `Add Layer` will add another layer of `Layer Size` to the network.
- `+` `-` on `Input` will change the number of nodes in the input layer.
- `+` `-` on `Output` will change the number of nodes in the output layer.
- Changing the values for the inputs will automatically update the output values.

##### Nodes
- Clicking on a node will select it and bring up an information panel.
- Anything that is changed here will be reflected in real time.
- You can change this node's `Color`.
- `Activation Function` can be changed to any of the following functions of input x. Some require an additional input `a`. More information about these functions can be found [here](https://www.analyticsvidhya.com/blog/2020/01/fundamentals-deep-learning-activation-functions-when-to-use-them/).
  - `None`: Nothing will be done to the output.
  - `Binary Step`: Will output 1 if `x` > 0, 0 otherwise.
  - `Linear`: Will multiply `x` by a constant `a`.
  - `Sigmoid`: Will return a value between 0 and 1 for all `x`.
  - `Tanh`: Will return a value between -1 and 1 for all `x`.
  - `ReLU`: Will return `x` if `x` > 0, 0 otherwise.
  - `Leaky ReLU`: Will return `x` if `x` > 0, 0.1 * `x` otherwise.
  - `ELU`: WIll return `x` if `x` > 0, `a` * (e<sup>x</sup> - 1) otherwise.
  - `Swish`: Similar to ReLU, follows the equation x / (1 + e<sup>-x</sup>).
- `Bias` Will be added to the sum of the inputs before the activation function.
- You can also see the `ID`, `X Position`, `Y Position`, and `Value` of the node.

##### Edges
- Clicking on an edge will select it and bring up a different information panel.
- Again, anything change will update in real time.
- `Color` will change the color of the edge
- `Weight` will change the weight of the edge
- You can also see the `ID` of this edge.
