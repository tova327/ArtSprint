
import "./App.css"
import StartPage from "./components/auth/StartPage"
import SubApp from "./components/SubApp"
import { useAuth } from "./components/auth/AuthProvider"



function App() {
  
  
  const{isAuthenticated} = useAuth()
  

  return (<>
    {isAuthenticated ? <StartPage  /> : <SubApp />}
  </>)
}

export default App
