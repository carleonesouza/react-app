import React from 'react';
import { Route, BrowserRouter} from 'react-router-dom';

import Home from '../pages/home';
import CreatePoint from '../pages/createPoint';
import SuccessfullyCreated from '../pages/success';

const Routes = () => {
    return (
        <BrowserRouter>
        <Route component={Home}  path="/" exact />
        <Route component={CreatePoint}  path="/create-point"/>
        <Route component={SuccessfullyCreated} path="/success"/>
        </BrowserRouter>
    );
}

export default Routes;