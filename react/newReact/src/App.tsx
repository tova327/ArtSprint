import { Provider } from 'react-redux'
import './App.css'
// import Try from './components/Try'
import store from './store/store'
import StartPage from './components/StartPage'
//import ShowPaintings from './components/ShowPaintings'
import { useState } from 'react'
import SubApp from './components/SubApp'
import '@ant-design/v5-patch-for-react-19';
function App() {
  const[showStart,setShowStart]=useState(true)

  return (
    <>
    <h1>helo!!!!!!!!!!</h1>
      <Provider store={store}>
        {/* <Try /> */}
        {showStart?<StartPage toClose={()=>setShowStart(false)}/>:<SubApp/>}
        
      </Provider>
    </>
  )
}

export default App
