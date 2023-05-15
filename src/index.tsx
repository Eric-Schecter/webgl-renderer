import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './index.module.scss';
import * as serviceWorker from './serviceWorker';
import { App } from './App';
import { routes } from './App/routes';

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
