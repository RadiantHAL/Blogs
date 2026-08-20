import { Routes , Route} from "react-router-dom"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Protected from "./features/auth/components/Protect"
import Home from "./features/main/page/home"




const App = () => {
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Protected>
          <Home/></Protected>}/>
      </Routes>
    </div>
  )
}

export default App
