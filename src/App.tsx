import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import AuthLayout from "./components/AuthLayout/AuthLayout"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => {
  const appRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<AuthLayout />}>
        <Route
          path=''
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path='login' element={<LoginPage />} />
      </Route>
    ),
    { basename: `${process.env.PUBLIC_URL}` }
  )
  return <RouterProvider router={appRouter} />
}

export default App
