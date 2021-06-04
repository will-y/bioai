import React from 'react';
import './Header.css';
import NavComponent from "./NavComponent";

class NavBar extends React.Component {
    render() {
        return (
          <div className="nav-bar">
              {/*<NavComponent active={true} title="Home" path="/" />*/}
              {/*<NavComponent active={false} title="About" path="/about" />*/}
              {/*<NavComponent active={false} title="Projects" path="/projects" />*/}
              {/*<NavComponent active={false} title="Contact Me" path="/contact" />*/}
              {this.props.pages.map((comp, index) =>
                <NavComponent active={this.props.activePath === comp.path} title={comp.name} path={comp.path} key={index} />
              )}
          </div>
        );
    }
}

export default NavBar;
