import { useContext,useEffect,useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";
import PropTypes from "prop-types";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (food_list.length > 0) {
      setLoading(false);
    }
  }, [food_list]);
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      {loading ? (
        <p className="fetching-loader">🍔 Just a moment! We’re setting the table...</p>
      ) : (
        <div className="food-display-list">
          {food_list.map((item, index) => {
            if (category === "All" || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  image={item.image}
                  price={item.price}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;

FoodDisplay.propTypes = {
  category: PropTypes.string,
};
