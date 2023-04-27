import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageChatRight } from 'src/components';
import { Chat, Login } from 'src/pages/_index';

const RouterConfig = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Chat />
    },
    {
      path: "/chats",
      element: <Chat />,
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
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}
export default RouterConfig