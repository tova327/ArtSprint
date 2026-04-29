
import "./App.css"
import SubApp from "./components/SubApp"
import { AuthProvider } from "./components/auth/AuthProvider"



function App() {
  return (<><AuthProvider>
     <SubApp />
  </AuthProvider></>)
}

export default App
