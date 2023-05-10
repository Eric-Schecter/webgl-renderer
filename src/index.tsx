import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { TriangleDemo, ModelDemo, ClipPlaneDemo } from './App/examples';

const routes = [
  { path: '/', app: TriangleDemo },
  { path: '/model', app: ModelDemo },
  { path: '/clip-plane', app: ClipPlaneDemo },
]

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        {routes.map((d, i) => <Route key={d.path + i} exact path={d.path} render={() => <App GL_App={d.app} />} />)}
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
