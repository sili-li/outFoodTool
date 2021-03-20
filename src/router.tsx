import React from 'react';
// @ts-ignore
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Redirect, Route, Router } from 'react-router-dom';
import { LoadableExamplePage } from './pages/Example/Loadable';
import homePage from './pages/homePage/homePage';
import orderDetailPage from './pages/OrderDetailPage/OrderDetail'
import orderPage from './pages/OrderPage/orderPage'
import history from './utils/history-helper';
import { withdrawalPage } from './pages/WithdrawalPage/withdrawalPage';
import { WithdrawalHistoryPage } from './pages/WithdrawalHistoryPage/WithdrawalHistoryPage';
import { AccoutInfoPage } from './pages/AccountInfoPage/AccountInfoPage';

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
    routerPath: 'order',
    pageTitle: '订单中心',
    component: orderPage
  },
  {
    routerPath: 'orderDetail',
    pageTitle: '订单详情',
    component: orderDetailPage
  },
  {
    routerPath: "withdrawal",
    pageTitle: "提现",
    component: withdrawalPage
  },
  {
    routerPath: "withdrawalHistroy",
    pageTitle: "提现记录",
    component: WithdrawalHistoryPage
  },
  {
    routerPath: "accountInfo",
    pageTitle: "提现信息",
    component: AccoutInfoPage
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
