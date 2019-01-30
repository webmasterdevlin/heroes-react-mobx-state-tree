import React, { Component } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import HeaderNav from "./common-components/HeaderNav";
import Router from "./router";
import DevTools from "mobx-react-devtools";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <>
          <HeaderNav />
          <div className="container">
            <Router />
            <DevTools />
          </div>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
