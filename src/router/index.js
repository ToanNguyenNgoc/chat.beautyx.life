import {createBrowserRouter, Route, Router, RouterProvider, Routes} from 'react-router-dom'
import MyApp from '../Chat'
import PageChatRight from '../PageChatRight';

const RouterConfig = ()=>{
  const router = createBrowserRouter([
        {
          path: "/",
          element: <MyApp/>
        },
        {
          path: "/chats",
          element: <MyApp/>,
          children:[
            {
              path:':id',
              element:<PageChatRight/>
            }
          ]
        },
      ]);
    return (
     <RouterProvider router={router}>
        
     </RouterProvider>
    )
}
export default RouterConfig