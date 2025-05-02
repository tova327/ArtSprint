import { Provider } from 'react-redux'
import './App.css'
import Try from './components/Try'
import store from './store/store'

function App() {


  return (
    <>
      <Provider store={store}>
        <Try />
      </Provider>
    </>
  )
}

export default App
