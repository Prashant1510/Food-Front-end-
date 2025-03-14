import Navbar from "./components/Navbar/Navbar"
import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder"
import Footer from "./components/Footer/Footer"
import { useState } from "react"
import LoginPopup from "./components/LoginPopup/LoginPopup"
import MyOrder from "./pages/MyOrders/MyOrder"
import { ToastContainer } from 'react-toastify';


const App = () => {
  const[showLogin, setShowLogin] = useState(false);
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : <></>}
    <div className="app">
      <ToastContainer />
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path="/" element= {<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order" element={<PlaceOrder/>}/>
        <Route path="/myorders" element={<MyOrder/>}/>

      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App