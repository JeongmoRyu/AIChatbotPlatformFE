import AppRouterProvider from '@/app/providers/router';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <AppRouterProvider />
    </RecoilRoot>
  );
}

export default App;
