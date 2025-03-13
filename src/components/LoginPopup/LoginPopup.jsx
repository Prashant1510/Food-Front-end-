import { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import PropTypes from "prop-types";
import { StoreContext } from '../../context/StoreContext';
import axios from "axios"
import {toast} from 'react-toastify';

const LoginPopup = ({setShowLogin}) => {
    const[currentState, setCurrentState] = useState('Login')
    const[data,setData] = useState({
        name:"",
        email:"",
        password:""
    })
    const[loading, setLoading] = useState(false)
    const{url, setToken} = useContext(StoreContext)
    const onlogin = async (event)=>{
        event.preventDefault();
        setLoading(true)
        let newUrl = url;
        if (currentState == "Login") {
            newUrl+= '/api/user/login'
        }else{
            newUrl+= '/api/user/register'
        }
        try {
            const response = await axios.post(newUrl,data)
            if(response.data.success){
                setToken(response.data.token)
                localStorage.setItem("token",response.data.token)
                setShowLogin(false)
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }


  return (
    <div className='login-popup'>
        <form  onSubmit={onlogin} className='login-popup-container'>
            <div className="login-popup-title">
                <p>{currentState}</p>
                <img onClick={()=>{setShowLogin(false)}} src={assets.cross_icon} alt="close" />
            </div>
            <div className="login-popup-inputs">
                {currentState==="Login"?<></>:<input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your Name' required />}
                <input name='email' onChange={onChangeHandler} value={data.email}  type="email" placeholder='Your Email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>
            <button type='submit' disabled={loading}>
                    {loading ? 'Processing...' : currentState === "Sign Up" ? "Create Account" : "Login"}
            </button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>I agree to the term of use and privacy policy</p>
            </div>
            {currentState === "Login"? <p>Create a new account <span onClick={()=>{setCurrentState("Sign Up")}}>Click here</span></p>:<p>Already have an account <span onClick={()=>{setCurrentState("Login")}}>Login here</span></p> }
        </form>
    </div>
  )
}

export default LoginPopup;

LoginPopup.propTypes = {
    setShowLogin: PropTypes.func.isRequired,  // Ensure 'setShowLogin' is a function and required
};