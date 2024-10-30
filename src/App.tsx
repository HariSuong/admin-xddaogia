import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import LayoutWeb from "./components/layout"
import PrivateRoute from "./components/private-route"
import Article from "./pages/article"
import Feedback from "./pages/feedback"
import LoginPage from "./pages/login"
import LogoutPage from "./pages/logout"
import Cat from "./pages/menu"
import Photos from "./pages/photo"
import PostPage from "./pages/post"
import RegisterPage from "./pages/register"
import Slider from "./pages/slide"
import UserPage from "./pages/user"

// const Layout = () => (
//   <div className="layout-app">
//     <Header />
//     <Outlet />
//     <Footer />
//   </div>
// )

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWeb />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        element: <PrivateRoute />, // Bảo vệ các route bên trong
        children: [
          { index: true, element: <PostPage /> },
          { path: "users", element: <UserPage /> },

          { path: "posts", element: <PostPage /> },
          { path: "sliders", element: <Slider /> },
          { path: "feedbacks", element: <Feedback /> },
          { path: "photos", element: <Photos /> },
          { path: "cats", element: <Cat /> },
          { path: "articles", element: <Article /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
