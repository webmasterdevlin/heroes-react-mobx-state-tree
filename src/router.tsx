import React from "react";
import { Redirect, Route, Switch } from "react-router";
import Heroes from "./pages/heroes/Heroes";
import EditHero from "./pages/heroes/EditHero";
import Villains from "./pages/villains/Villains";
import EditVillain from "./pages/villains/EditVillain";

import createBrowserHistory from "history/createBrowserHistory";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { Provider } from "mobx-react";
import HeroStore from "./stores/HeroStore";
import VillainStore from "./stores/VillainStore";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
  HeroStore,
  VillainStore
};

const history = syncHistoryWithStore(browserHistory, routingStore);

const Router = () => (
  <Provider {...stores}>
    <Switch>
      <Route history={history} path="/heroes" component={Heroes} />
      <Route history={history} path="/villains" component={Villains} />
      <Route history={history} path="/edit-hero/:id" component={EditHero} />
      <Route
        history={history}
        path="/edit-villain/:id"
        component={EditVillain}
      />
      <Redirect from="/" exact to="/heroes" />
    </Switch>
  </Provider>
);

export default Router;
