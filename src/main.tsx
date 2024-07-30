import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './views/login/Login'
import { Register } from './views/register/Register'
import { UpdatePassword } from './views/updatePassword/UpdatePassword'
import { ErrorPage } from './views/errorPage/ErrorPage'
import './index.css'

const routes = [
  {
    path: '/',
    element: <div>11</div>,
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
    element: <UpdatePassword />,
  },
]
const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
