import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Chat } from 'src/pages/Home/components';
import { Main, Login } from 'src/pages/_index';
import { ProtectedRoute } from './ProtectedRoute'

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
      path: "/dev2021/ManageMessage",
      element: <ProtectedRoute><Main /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <Chat />
        }
      ]
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