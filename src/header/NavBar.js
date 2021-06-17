import React from 'react';
import './Header.css';
import NavComponent from "./NavComponent";

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.enabled = false;

        this.toggleNav = this.toggleNav.bind(this);
        this.toggleRef = React.createRef();
    }

    toggleNav() {
        this.toggleRef.current.style.marginTop = this.enabled ? "-100%" : "0";
        this.toggleRef.current.style.visibility = this.enabled ? "hidden" : "visible";
        this.enabled = !this.enabled;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        if (window.innerWidth > 600 && this.enabled) {
            this.toggleNav();
        }
    }

    render() {
        return (
            <div className="nav-wrapper">
                <div className="nav-bar-inline">
                    {this.props.pages.map((comp, index) =>
                        <NavComponent active={this.props.activePath === comp.path} title={comp.name} path={comp.path}
                                      key={index} classes="nav-component-inline"/>
                    )}
                </div>
                <div className="nav-bar-stacked">
                    <button className="btn nav-toggle" onClick={this.toggleNav}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-list"
                             viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                </div>
                <div className="nav-toggle-zone" ref={this.toggleRef}>
                    {this.props.pages.map((comp, index) =>
                        <NavComponent active={this.props.activePath === comp.path} title={comp.name} path={comp.path}
                                      key={index} classes="nav-component-stacked"/>
                    )}
                </div>
            </div>
        );
    }
}

export default NavBar;
