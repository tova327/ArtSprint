import { Provider } from 'react-redux'
import './App.css'
// import Try from './components/Try'
import store from './store/store'
import StartPage from './components/StartPage'

function App() {


  return (
    <>
      <Provider store={store}>
        {/* <Try /> */}
        <StartPage/>
      </Provider>
    </>
  )
}

export default App
