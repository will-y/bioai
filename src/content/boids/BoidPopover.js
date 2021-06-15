import React from "react";
import '../common/Popover.css';

class BoidPopover extends React.Component {
    render() {
        return (
            <div>
                <h2>Boids</h2>
                <h3>Background</h3>
                <p>Boids model a swarm of birds or other animals. Each boid's behavior (velocity) is determined by certain rules that have to do with other boids in its area. More information can ve found <a href="https://en.wikipedia.org/wiki/Boids" target="_blank" rel="noreferrer">here.</a></p>
                <h3>Rules</h3>
                <p>Rule 1: Boids try to go towards the center of mass of the flock.</p>
                <p>Rule 2: Boids try to stay away from other nearby boids.</p>
                <p>Rule 3: Boids try to match the speed of other nearby boids.</p>
                <p>Rule 4: Boids try to stay on the screen.</p>
                <p>Rule 5: Boids are attracted to the blue circle.</p>
                <p>Rule 6: Boids are afraid of the red predator.</p>
                <h3>How to Use the App</h3>
                <p>Press start to start the boids moving. Press it again to pause. Press reset to clear the attractor and the predator and reset the boids to random positions. Any of the settings will cause the simulation to update in real time.</p>
                <h4>Settings</h4>
                <h5>Radius [1-20]</h5>
                <p>Controls the size of the boids.</p>
                <h5>Repel [0-200]</h5>
                <p>Determines the amount that the boids want stay away from each other.</p>
                <h5>Speed Limit [0-200]</h5>
                <p>Controls the max speed that the boids can travel.</p>
                <h5>CoM Attraction [1-200]</h5>
                <p>Controls how much the boids try to stay together.</p>
                <h5>Predator?</h5>
                <p>If checked, a red predator will appear and chase the boids.</p>

            </div>
        );
    }
}

export default BoidPopover;
