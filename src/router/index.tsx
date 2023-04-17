import Chat from 'src/Chat';
import PageChatRight from '../PageChatRight';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
  ]);
  return (
    <RouterProvider router={router} />
  )
}
export default RouterConfig