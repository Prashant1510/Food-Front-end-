import { useContext, useState} from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

const PlaceOrder = () => {
  const { getTotalCartAmmount, cartItems, url } = useContext(StoreContext);

  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Check if all fields in formData are filled
  const isFormComplete = Object.values(formData).every((value) => value.trim() !== "");

  // check if the cart is empty
  const isCartEmpty = isEmpty(cartItems);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle payment
  const handlePayment = async () => {
    if (isCartEmpty) {
      alert("Your cart is empty.");
      return;
    }
    if (!isFormComplete) {
      alert("Please fill all the fileds of form.");
      return;
    }

    const amount =
      getTotalCartAmmount() + (getTotalCartAmmount() === 0 ? 0 : 40);

    try {
      // Step 1: Call backend API to create an order
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const { data } = await axios.post(
        url + "/api/order/place",
        {
          items: cartItems,
          amount,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zipCode,
            country: formData.country,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = data.orderId;
      const userId = data.userId;

      // Step 2: Use Razorpay Checkout
      const options = {
        key: "rzp_test_Yeup767rJBOxR3", // Replace with Razorpay Key ID
        amount: data.amount * 100,
        currency: "INR",
        name: `${formData.firstName} ${formData.lastName}`,
        description: "Order Payment",
        // image:
        //   "https://t3.ftcdn.net/jpg/06/47/72/54/360_F_647725431_ViQtenx2e9vDYNaCk7Cq4uW86igEXyBO.jpg", // Optional
        order_id: data.razorpayOrderId,

        handler: async (response) => {
          const paymentData = {
            orderId: orderId,
            userId: userId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verification = await axios.post(
            url + "/api/order/verify",
            paymentData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (verification.data.success) {
            alert("Payment Successful");
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            alert("Payment was cancelled or closed by the user.");
            console.log("User closed the payment modal.");
          },
        },
      };
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form action="" className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            value={formData.firstName}
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleInputChange}
          />
          <input
            value={formData.lastName}
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleInputChange}
          />
        </div>
        <input
          value={formData.email}
          name="email"
          type="text"
          placeholder="Email Address"
          onChange={handleInputChange}
        />
        <input
          value={formData.street}
          name="street"
          type="text"
          placeholder="Street"
          onChange={handleInputChange}
        />
        <div className="multi-fields">
          <input
            value={formData.city}
            name="city"
            type="text"
            placeholder="City"
            onChange={handleInputChange}
          />
          <input
            value={formData.state}
            name="state"
            type="text"
            placeholder="State"
            onChange={handleInputChange}
          />
        </div>
        <div className="multi-fields">
          <input
            value={formData.zipCode}
            name="zipCode"
            type="text"
            placeholder="Zip Code"
            onChange={handleInputChange}
          />
          <input
            value={formData.country}
            name="country"
            type="text"
            placeholder="Country"
            onChange={handleInputChange}
          />
        </div>
        <input
          value={formData.phone}
          name="phone"
          type="text"
          placeholder="Phone"
          onChange={handleInputChange}
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹ {getTotalCartAmmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {getTotalCartAmmount() === 0 ? 0 : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹ {getTotalCartAmmount() === 0 ? 0 : getTotalCartAmmount() + 40}
              </b>
            </div>
          </div>
          <button type="button" onClick={handlePayment} > 
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
