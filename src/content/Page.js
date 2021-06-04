import React from 'react';
import Header from "../header/Header";
import './Page.css';

class Page extends React.Component {
    render() {
        return (
            <div className="page">
                <Header activePath={window.location.pathname} pages={this.props.pages}/>
                <div className="page-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Page;
