import { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets.js";
const MyOrder = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/orders",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setData(response.data.data);
    console.log(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {Object.entries(order.items[0]).map(([itemId, item], index) => {
                  return item.name + " X " + item.quantity+", ";
                })}
              </p>
              <p>Amount : {order.amount}.00 </p>
              <p>Items : {Object.keys(order.items[0]).length}</p>
              <p><span>&#x25cf; </span> <b>{order.status}</b></p>
              <button>Track Order <span><img className="track-img" src={assets.track_icon} alt="" /></span></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrder;
