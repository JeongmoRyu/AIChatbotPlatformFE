// @/app/router.tsx
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import LayoutCommon from '@/shared/layouts/LayoutCommon/view/LayoutCommon';
import LayoutHome from '@/shared/layouts/LayoutHome';
import LayoutChatHub from '@/shared/layouts/LayoutChathub/view/LayoutChatHub';

import PageHome from '@/pages/Home/view/PageHome';
import PageChathub from '@/pages/Chathub/view/PageChathub';
import PageChatplay from '@/pages/Chatplay/view/PageChatplay';
import PageEmbeddingRanker from '@/pages/EmbeddingRanker/view/PageEmbeddingRanker';
import PageEmbeddingLeaderBoard from '@/pages/EmbeddingRanker/view/PageEmbeddingLeaderBoard';
import PageLLMTemplates from '@/pages/LLMTempltes/view/PageLLMTemplates';
import PageAIChat from '@/pages/AIChat/view/PageAIChat';
import PageEmbeddingHistory from '@/pages/EmbeddingRanker/view/PageEmbeddingHistory';
import LoginPage from '@/pages/Login/view/LoginPage';
import PageFunction from '@/pages/Chathub/view/PageFunction';
import LayoutChatHubMain from '@/shared/layouts/LayoutChatHubMain';
import PageChatBuilder from '@/pages/Chathub/view/PageChatBuilder';
import LayoutChatHubBuilder from '@/shared/layouts/LayoutChathubBuilder';
import PageChatRoom from '@/pages/Chathub/view/PageChatRoom';
import PageChatUI from '@/pages/Chathub/view/PageChatUI';

import TaskNews from '@/pages/LLMTempltes/components/taskNews/view/TaskNews';
import TaskPromotion from '@/pages/LLMTempltes/components/taskPromotion/view/TaskPromotion';
import TaskScript from '@/pages/LLMTempltes/components/taskScript/view/TaskScript';
import TaskSummary from '@/pages/LLMTempltes/components/taskSummary/view/TaskSummary';
import TaskEdit from '@/pages/LLMTempltes/components/taskEdit/view/TaskEdit';
import TaskTranslate from '@/pages/LLMTempltes/components/taskTranslate/view/TaskTranslate';
import TaskAnalysis from '@/pages/LLMTempltes/components/taskAnalysis/view/TaskAnalysis';
import TaskCode from '@/pages/LLMTempltes/components/taskCode/view/TaskCode';
import PageLLMTaskLayout from '@/pages/LLMTempltes/layout/view/PageLLMTaskLayout';
import TaskEmail from '@/pages/LLMTempltes/components/taskEmail/view/TaskEmail';
import PageAccount from '@/pages/Account/view/PageAccount';
import PageMyPage from '@/pages/Account/view/PageMyPage';

const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

const routes = createRoutesFromElements(
  <>
    <Route
      path="/"
      element={
        <LayoutCommon>
          <AnimatedOutlet />
        </LayoutCommon>
      }
    >
      <Route index element={<Navigate to="/home" replace />} />
      <Route
        path="home"
        element={
          <LayoutHome>
            <PageHome />
          </LayoutHome>
        }
      />
      <Route path="ai-chat" element={<PageAIChat />} />
      <Route
        path="chat-hub"
        element={
          <LayoutChatHubMain>
            <PageChathub />
          </LayoutChatHubMain>
        }
      />
      <Route
        path="function"
        element={
          <LayoutChatHubBuilder>
            <PageFunction />
          </LayoutChatHubBuilder>
        }
      />
      <Route
        path="chatbuilder"
        element={
          <LayoutChatHubBuilder>
            <PageChatBuilder />
          </LayoutChatHubBuilder>
        }
      />
      <Route path="chatroom">
        <Route
          index
          element={
            <LayoutChatHubBuilder>
              <PageChatRoom />
            </LayoutChatHubBuilder>
          }
        />
        <Route
          path=":roomId"
          element={
            <LayoutChatHub>
              <PageChatUI />
            </LayoutChatHub>
          }
        />
      </Route>
      <Route path="chat-play" element={<PageChatplay />} />
      <Route path="embedding-ranker" element={<PageEmbeddingRanker />} />
      <Route path="embedding-leaderboard" element={<PageEmbeddingLeaderBoard />} />
      <Route path="embedding-history" element={<PageEmbeddingHistory />} />
      <Route path="mypage" element={<PageMyPage />} />
      <Route path="account" element={<PageAccount />} />
      <Route path="llm-template" element={<PageLLMTemplates />} />
      <Route path="llm-template/task" element={<PageLLMTaskLayout />}>
        <Route path="email" element={<TaskEmail />} />
        <Route path="news" element={<TaskNews />} />
        <Route path="promotion" element={<TaskPromotion />} />
        <Route path="script" element={<TaskScript />} />
        <Route path="summary" element={<TaskSummary />} />
        <Route path="edit" element={<TaskEdit />} />
        <Route path="translate" element={<TaskTranslate />} />
        <Route path="analysis" element={<TaskAnalysis />} />
        <Route path="code" element={<TaskCode />} />
      </Route>
    </Route>
    <Route path="login" element={<LoginPage />} />,
  </>,
);

const router = createBrowserRouter(routes);

const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};

export default AppRouterProvider;
