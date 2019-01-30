import * as React from "react";
import { Link, NavLink } from "react-router-dom";

export interface HeaderNavState {
    navIsCollapse: boolean;
}

export default class HeaderNav extends React.Component<any, HeaderNavState> {
    state = {
        navIsCollapse: true
    };

    toggleNavBar = () => {
        const navIsCollapse = !this.state.navIsCollapse;
        this.setState({ navIsCollapse });
    };

    public render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand">
          <li className="fas fa-cube" />
          React Tour of Heroes
        </span>
                <button
                    onClick={this.toggleNavBar}
                    className="navbar-toggler"
                    type="button"
                    data-toggle=" collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls=" navbarSupportedContent"
                    aria-expanded="false"
                    aria-label=" Toggle navigation"
                >
                    <span className=" navbar-toggler-icon" />
                </button>

                <div
                    className={
                        this.state.navIsCollapse
                            ? "collapse navbar-collapse"
                            : "navbar-collapse"
                    }
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Heroes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/villains">
                                Villains
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav my-2 my-lg-0">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://twitter.com/DevlinDuldulao"
                            >
                                <i className="layout-icon fab fa-twitter" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://github.com/webmasterdevlin"
                            >
                                <i className="layout-icon fab fa-github" />
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
