// StoreContext.jsx
import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_BACKEND_URL
  const [token,setToken] = useState("")
  const [food_list,setFoodList] = useState([])

  useEffect(() => {
    
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"))
      }
    }
    loadData();
  }, [])
  
  const fetchFoodList = async ()=>{
    const response = await axios.get(url+'/api/food/list')
    setFoodList(response.data.data)
  }
  
  const addToCart = async (itemId, name, price) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { name, price, quantity: 0 }), // Preserve name and price or set defaults
        quantity: (prev[itemId]?.quantity || 0) + 1, // Increment quantity
      },
    }));
  
    // Update the database if the user is logged in
    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, name, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };
  

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      // Check if the item exists and has a quantity greater than 1
      if (prev[itemId] && prev[itemId].quantity > 1) {
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            quantity: prev[itemId].quantity - 1, // Decrement quantity
          },
        };
      } else {
        // If quantity is 1 or the item doesn't exist, remove it from the cart
        // eslint-disable-next-line no-unused-vars
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
    });
  
    // Update the database if the user is logged in
    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };
  

  const loadCartData = async (token)=>{
    const response = await axios.post(url+"/api/cart/get",{},{headers: {Authorization: `Bearer ${token}`},})
    setCartItems(response.data.cartData)
  }
  const getTotalCartAmmount = () => {
    let totalAmmount = 0;
    for (const item in cartItems) {
      if (cartItems[item].quantity > 0) {
        let itemInfo = food_list.find((product) => {
          return product._id === item;
        });
        totalAmmount += itemInfo.price * cartItems[item].quantity;
      }
    }
    return totalAmmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
