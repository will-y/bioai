import React from "react";
import './Home.css';
import {Link} from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <h1 className="text-center">Bio-Inspired Artificial Intelligence Demos</h1>
                <div className="contacts-container">
                    <div className="contact-wrapper">
                        <Link className="contact" to="/ca-1d">
                            <div className="contact-content">
                                <p className="contact-text">1D Cellular Automata</p>
                            </div>
                        </Link>
                    </div>
                    <div className="contact-wrapper">
                        <Link className="contact" to="/game-of-life">
                            <div className="contact-content">
                                <p className="contact-text">Game of Life</p>
                            </div>
                        </Link>
                    </div>
                    <div className="contact-wrapper">
                        <Link className="contact" to="/maze">
                            <div className="contact-content">
                                <p className="contact-text">Maze Solver</p>
                            </div>
                        </Link>
                    </div>
                    <div className="contact-wrapper">
                        <Link className="contact" to="/l-system">
                            <div className="contact-content">
                                <p className="contact-text">L System</p>
                            </div>
                        </Link>
                    </div>
                    <div className="contact-wrapper">
                        <Link className="contact" to="/boids">
                            <div className="contact-content">
                                <p className="contact-text">Boids</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
