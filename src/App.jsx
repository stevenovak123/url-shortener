import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AppLayout from './Layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Linking from './pages/Linking';
import Redirect from './pages/redirect';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/link/:id',
        element: <Linking />,
      },
      {
        path: '/:id',
        element: <Redirect />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
