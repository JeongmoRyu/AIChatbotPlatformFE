import '@/shared/styles/index.css';

import App from '@/app/App.tsx';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <App />,
  </RecoilRoot>,
);
