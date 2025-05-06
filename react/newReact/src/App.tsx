import { Provider } from 'react-redux'
import './App.css'
// import Try from './components/Try'
import store from './store/store'
import StartPage from './components/StartPage'
import ShowPaintings from './components/ShowPaintings'
import { useState } from 'react'

function App() {
  const[showStart,setShowStart]=useState(true)

  return (
    <>
      <Provider store={store}>
        {/* <Try /> */}
        {showStart&&<StartPage toClose={()=>setShowStart(false)}/>}
        <ShowPaintings/>
      </Provider>
    </>
  )
}

export default App
