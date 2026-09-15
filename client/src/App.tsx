import { Suspense, lazy } from "react"
import { Routes , Route, Navigate} from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import Protected from "./features/auth/components/Protect"
import HomeLayout from "./features/main/components/HomeLayout"
import { Provider } from "react-redux"
import { store } from "./store"

// Lazy load pages for better performance
const Register = lazy(() => import("./features/auth/pages/Register"))
const Login = lazy(() => import("./features/auth/pages/Login"))
const Home = lazy(() => import("./features/main/page/Home"))
const Profile = lazy(() => import("./features/main/page/Profile"))
const Help = lazy(() => import("./features/main/page/Help"))
const CreateBlog = lazy(() => import("./features/main/page/CreateBlog"))
const UserBlogs = lazy(() => import("./features/main/page/UserBlogs"))
const Settings = lazy(() => import("./features/main/page/Settings"))

const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Toaster position="bottom-right" />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <HomeLayout />
                </Protected>
              }
            >
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="user" element={<UserBlogs />}/ >
              <Route path="create" element={<CreateBlog />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </Suspense>
      </HelmetProvider>
    </Provider>
  )
}

export default App
