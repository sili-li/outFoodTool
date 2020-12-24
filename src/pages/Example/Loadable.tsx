import React from 'react';
import Loadable from 'react-loadable';

const LoadableExamplePage = Loadable({
  loader: () => import('./ExamplePage'),
  loading: () => <div>loading</div>
});

export { LoadableExamplePage };
