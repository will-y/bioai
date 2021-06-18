import React from 'react';
import './Header.css';
import NavComponent from "./NavComponent";

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: false
        }

        this.toggleNav = this.toggleNav.bind(this);
        this.toggleRef = React.createRef();
    }

    toggleNav() {
        if (this.state.enabled) {
            this.toggleRef.current.classList.remove("nav-toggle-zone-enabled");
        } else {
            this.toggleRef.current.classList.add("nav-toggle-zone-enabled");
        }
        // this.toggleRef.current.style.marginTop = this.state.enabled ? "-100%" : "0";
        // this.toggleRef.current.style.visibility = this.state.enabled ? "hidden" : "visible";
        this.setState((prevState) => {
            return {enabled: !prevState.enabled}
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    getTitle() {
        if (this.state.enabled) {
            return '';
        }
        for (let i = 0; i < this.props.pages.length; i++) {
            const page = this.props.pages[i];
            if (page.path === this.props.activePath) {
                return page.name;
            }
        }
    }

    handleWindowResize = () => {
        if (window.innerWidth > 600 && this.state.enabled) {
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
                    <span className="nav-component">{this.getTitle()}</span>
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
                                      key={index} classes="nav-component-stacked" clickFn={this.toggleNav}/>
                    )}
                </div>
            </div>
        );
    }
}

export default NavBar;
