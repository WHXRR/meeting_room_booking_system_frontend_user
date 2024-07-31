import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './views/login/Login'
import { Register } from './views/register/Register'
import { UpdateUserPassword } from './views/update_password/UpdatePassword'
import { ErrorPage } from './views/error_page/ErrorPage'
import { Index } from './views/index/Index'
import { UpdateInfo } from './views/update_info/UpdateInfo'
import './index.css'

const routes = [
  {
    path: '/',
    element: <Index />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/update_password',
    element: <UpdateUserPassword />,
  },
]
const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
