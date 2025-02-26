import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="w-full h-screen">
      {/* <Navbar />
      {/* <Home /> */}
      {/* <Product /> */}
      <Login />
      </div> 
    </>
  )
}

export default App
