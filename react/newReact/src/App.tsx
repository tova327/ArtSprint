"use client"

import { useEffect, useState } from "react"
import "./App.css"
import type { AppDispatch } from "./store/store"
import StartPage from "./components/auth/StartPage"
import SubApp from "./components/SubApp"
import { useDispatch } from "react-redux"
import axios from "axios"
import { setUser } from "./store/userSlice"



function App() {
  const [showStart, setShowStart] = useState(true)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const isAuth = async () => {
      const authToken = localStorage.getItem("authToken")
      console.log("in isAuth " + authToken)

      if (authToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_MY_API_URL}auth/authuser`, authToken, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`
            },
          })
          if (response.status === 200) {
            dispatch(setUser(response.data))
            setShowStart(false)
          }
        } catch (error) {
          console.error("User is not authenticated")
          localStorage.removeItem("authToken")
        }
      }
    }
    isAuth()
  }, [dispatch])

  return (<>
    {showStart ? <StartPage toClose={() => setShowStart(false)} /> : <SubApp />}
  </>)
}

export default App
