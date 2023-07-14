import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageChatRight } from 'src/components';
import { Chat, Login } from 'src/pages/_index';
import { ProtectedRoute } from './ProtectedRoute'

const RouterConfig = () => {
  const router = createBrowserRouter([
    {
      path: "/chats",
      element: <ProtectedRoute><Chat /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <PageChatRight />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: "/",
      element: <ProtectedRoute><Chat /></ProtectedRoute>,
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}
export default RouterConfig