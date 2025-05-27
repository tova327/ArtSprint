"use client"

import { useEffect, useState } from "react"
import "./App.css"
import type { AppDispatch } from "./store/store"
import StartPage from "./components/StartPage"
import SubApp from "./components/SubApp"
import { useDispatch } from "react-redux"
import axios from "axios"
import { setUser } from "./store/userSlice"
import { ThemeProvider } from "styled-components"
import { ConfigProvider } from "antd"

const theme = {
  primary: "#ff4081",
  secondary: "#ff9800",
  accent: "#56c6ff",
  success: "#29d98c",
  purple: "#7a42f4",
  navGlass: "rgba(255,255,255,0.85)",
  navBorder: "1px solid rgba(255,64,129,0.2)",
  borderRadius: "16px",
}

const antdTheme = {
  token: {
    colorPrimary: "#ff4081",
    colorSuccess: "#29d98c",
    colorWarning: "#ff9800",
    colorError: "#ff4757",
    borderRadius: 12,
    fontFamily: "Inter, system-ui, sans-serif",
  },
}

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

  return (
    <ConfigProvider theme={antdTheme}>
      <ThemeProvider theme={theme}>
        {showStart ? <StartPage toClose={() => setShowStart(false)} /> : <SubApp />}
      </ThemeProvider>
    </ConfigProvider>
  )
}

export default App
