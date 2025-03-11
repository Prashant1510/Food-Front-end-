import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="logo" src={assets.logo} alt="" />
          <p>
            Craving something delicious? Foodo brings every flavor to your
            doorstep — from sizzling Chinese, mouthwatering desserts, and
            classic veg dishes to savory non-veg delights. Available 24/7, we
            serve you happiness anytime you want! Enjoy easy online payments or
            pay with cash on delivery — all at prices that won’t burn a hole in
            your pocket. Fast, fresh, and affordable — Foodo is here to satisfy
            your every craving! Ready to order? Let’s get the feast started!
            🥢🍕🍰
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delevry</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-234-56789</li>
            <li>contact@fooodo.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 - All Right reserved</p>
    </div>
  );
};

export default Footer;
