import { Routes , Route} from "react-router-dom"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  )
}

export default App
