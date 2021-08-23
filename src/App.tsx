import React from 'react';
import './App.css';

import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Digest from "./components/Digest";

const App = () => (
    <div className="App">
        <Router basename={"/KloopDigests"}>
            <Switch>
                <Route exact path="/:date">
                    <Digest/>
                </Route>
                <Route path="/">
                    <Digest/>
                </Route>
            </Switch>
        </Router>
    </div>
);

export default App;
