// import * as H from 'history';
import { createBrowserHistory } from 'history';
// import { getEGPage } from '../constant/EGPage';
import pg from '../../package.json';
// import { AnalysisPageView } from './analysisHelper';

const updateDocumentTitle = (location: any) => {
  document.title = '首页';
};

const analysisPage = (location: any) => {
  // const routeName = _.replace(location.pathname, '/', '');
  // const analysisData = getEGPage(routeName);
  // if (!_.isEmpty(analysisData)) {
  //   AnalysisPageView(analysisData.WidgetNo, analysisData);
  // }
};
const pathPrefix = pg.homepage;
export const history = createBrowserHistory({ basename: pathPrefix });
updateDocumentTitle(history.location);
// 路由改变，更新页面标题
history.listen(location => {
  updateDocumentTitle(location);
  analysisPage(location);
});

export default history;
