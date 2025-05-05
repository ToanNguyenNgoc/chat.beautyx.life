import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login, Main, ManageComment } from 'src/pages/_index';
import { Chat } from 'src/pages/Home/components';
import { ProtectedRoute } from './ProtectedRoute';

const RouterConfig = () => {
  const router = createBrowserRouter([
    {
      path: "/ManageMessage",
      element: <ProtectedRoute><Main /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <Chat />
        }
      ]
    },
    {
      path: "/dev/ManageMessage",
      element: <ProtectedRoute><Main /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <Chat />
        }
      ]
    },
    {
      path:'/ManageComment',
      element:<ProtectedRoute><ManageComment/></ProtectedRoute>
    },
    {
      path:'/dev/ManageComment',
      element:<ProtectedRoute><ManageComment/></ProtectedRoute>
    },
    {
      path: "/chats",
      element: <ProtectedRoute><Main /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <Chat />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: "/",
      element: <ProtectedRoute><Main /></ProtectedRoute>,
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}
export default RouterConfig