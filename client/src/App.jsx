import { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'

function Layout(){
  const location = useLocation();

}

function App() {
  const [count, setCount] = useState(0)
  return (
    <main className='w-full min-h-screen'>
     <Routes>
         <Route element={<Layout />}>
           {/* <Route path='/' element={<Navigate to='/dashboard' />} />
           <Route path='/dashboard' element={<Dashboard />} /> */}
         </Route>
         <Route path='/register' element={<Register />} />
         <Route path='/login' element={<Login />} />
         <Route path='/' element={<Home />} />
         <Route path='/product' element={<Product />} />
     </Routes>
     {/* Toast container for showing notifications
     <ToastContainer 
         position="top-center" 
         autoClose={3000} 
         hideProgressBar={false} 
         newestOnTop 
         closeOnClick 
         pauseOnHover 
         draggable 
         theme="dark" 
       /> */}
     {/* <Toaster richColors /> */}
    </main>
   )

  return (
    <>
    <div className="w-full h-screen">
      {/* <Navbar />
      {/* <Home /> */}
      {/* <Product /> */}
      {/* <Login /> */}
      <Register />
      </div> 
    </>
  )
}

export default App
