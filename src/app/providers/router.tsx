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
import LayoutChatHub from '@/shared/layouts/LayoutChatHub';

import PageHome from '@/pages/Home/view/PageHome';
import PageChathub from '@/pages/Chathub/view/PageChathub';
import PageChatplay from '@/pages/Chatplay/view/PageChatplay';
import PageEmbeddingRanker from '@/pages/EmbeddingRanker/view/PageEmbeddingRanker';
import PageEmbeddingLeaderBoard from '@/pages/EmbeddingRanker/view/PageEmbeddingLeaderBoard';
import PageLLMTemplates from '@/pages/LLMTempltes/view/PageLLMTemplates';
import PageAIChat from '@/pages/AIChat/view/PageAIChat';
import PageEmbeddingHistory from '@/pages/EmbeddingRanker/view/PageEmbeddingHistory';

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
        <LayoutChatHub>
          <PageChathub />
        </LayoutChatHub>
      }
    />
    <Route path="chat-play" element={<PageChatplay />} />
    <Route path="embedding-ranker" element={<PageEmbeddingRanker />} />
    <Route path="embedding-leaderboard" element={<PageEmbeddingLeaderBoard />} />
    <Route path="embedding-history" element={<PageEmbeddingHistory />} />
    <Route path="llm-template" element={<PageLLMTemplates />} />
  </Route>,
);

const router = createBrowserRouter(routes);

const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};

export default AppRouterProvider;
