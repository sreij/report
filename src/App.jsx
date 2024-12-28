import { useState, useEffect } from "react";
import Footer from "./Footer"

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Tokyo');
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://goweather.herokuapp.com/weather/${city}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeather();
    }, [city]);
    return (
        <div>
            <div>
                <label>天気を検索</label>
                <input id="inputfield" placeholder="検索"></input>
                <button onClick={() => {
                    setCity(document.querySelector("#inputfield").value);
                    fetchWeather();
                }}>
                    検索
                </button>
            </div>
            {weatherData ? (
                <div>
                    <main>
                        <h1>Weather in {city}</h1>
                        <p>Temperature:{weatherData.temperature}</p>
                        <p>Wind: {weatherData.wind}</p>
                        <p>Description: {weatherData.description}</p>
                    </main>
                    <aside>
                        <h2>Forecast:</h2>
                        <ul> {weatherData.forecast.map((day, index) => (
                            <li key={index}>
                                Day {day.day}: Temperature: {day.temperature}, Wind: {day.wind}
                            </li>
                        ))}
                        </ul>
                    </aside>
                </div>) : (<p>Loading...</p>)}
            <Footer />
        </div>
    );
};