import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FoodData from "./FoodData";
import Header from './Header';
import Footer from "./Footer";
import { UserContext } from "../context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";
import debounce from 'lodash.debounce'; // Import debounce utility

export default function SearchFood() {
    const loggedData = useContext(UserContext);
    const location = useLocation();
    const { foodItem, details, quantity, id, mealNumber, eatenDate } = location.state || {};

    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(foodItem || null);
    const [loading, setLoading] = useState(false);
    const [color] = useState("#d73750");

    useEffect(() => {
        if (foodItem) {
            setFood(foodItem);
        }
    }, [foodItem]);

    // Debounced search function with a delay of 300ms
    const debouncedSearchFood = debounce(async (query) => {
        if (query.length !== 0) {
            setLoading(true);
            try {
                const [foodsResponse, userFoodsResponse] = await Promise.all([
                    fetch(`http://localhost:8000/foods/${query}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${loggedData.loggedUser.token}`
                        }
                    }),
                    fetch(`http://localhost:8000/userfoods/${query}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${loggedData.loggedUser.token}`
                        }
                    })
                ]);

                const foodsData = await foodsResponse.json();
                const userFoodsData = await userFoodsResponse.json();

                const combinedData = [
                    ...(foodsData.message === undefined ? foodsData : []),
                    ...(userFoodsData.message === undefined ? userFoodsData : [])
                ];

                setFoodItems(combinedData);
            } catch (err) {
                console.log(err);
                setFoodItems([]);
            } finally {
                setLoading(false);
            }
        } else {
            setFoodItems([]);
            setLoading(false);
        }
    }, 500);

    // Handle input change and trigger debounce function
    function handleInputChange(event) {
        const query = event.target.value.trim(); // Trim whitespace
        debouncedSearchFood(query); // Call debounced function with the query
    }

    // Function to close the search container
    function closeSearchContainer() {
        setFoodItems([]);
    }

    return (
        <section className="container search-container">
            <Header />
            <Footer />
            <div className="search">
                <input className="search-inp" type="search" onChange={handleInputChange} placeholder="Yiyecek Arayın" />
                {loading ? (
                    <div className="spinner-container-searchFood">
                        <ClipLoader
                            color={color}
                            loading={loading}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    foodItems.length !== 0 && (
                        <div className="search-results">
                            {foodItems.map((item) => (
                                <p className="item" onClick={() => { setFood(item); closeSearchContainer(); }} key={item._id}>{item.NameTr}</p>
                            ))}
                        </div>
                    )
                )}
            </div>
            {food !== null ? (
                <FoodData food={food} quantity={quantity} details={details} id={id} mealNumber={mealNumber} eatenDate={eatenDate} />
            ) : null}
        </section>
    );
}