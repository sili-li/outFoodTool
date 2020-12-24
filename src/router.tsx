import React from 'react';
// @ts-ignore
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Redirect, Route, Router } from 'react-router-dom';
import { LoadableExamplePage } from './pages/Example/Loadable';
import history from './utils/history-helper';
import homePage from './pages/homePage/homePage';
export interface RouteType {
  routerPath: string;
  pageTitle: string;
  component: React.ComponentType;
  cache?: boolean;
}

const routes: RouteType[] = [
  {
    routerPath: '',
    pageTitle: '外卖联盟',
    component: homePage
  },
  {
    routerPath: 'index',
    pageTitle: '外卖联盟',
    component: homePage
  },
  {
    routerPath: 'example/:exampleId?',
    pageTitle: '测试页面',
    component: LoadableExamplePage
  }
];

function AppRouter() {
  return (
    <Router history={history}>
      <CacheSwitch>
        {routes.map((route: RouteType, index: number) => {
          return route.cache ? (
            <CacheRoute exact={true} path={`/${route.routerPath}`} key={index} component={route.component} />
          ) : (
              <Route
                // strict={true}
                exact={true}
                path={`/${route.routerPath}`}
                key={index}
                component={route.component}
              />
            );
        })}
        <Redirect to="/" />
      </CacheSwitch>
    </Router>
  );
}

export default AppRouter;
