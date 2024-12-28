import { useState, useEffect } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
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

    useEffect(() => {
        const fetchLocation = async() => {
            
        };
        fetchLocation();
    }, []);
    return (
        <div>
            <div>
                <label>天気を検索</label>
                <input id="inputfield" placeholder="場所"></input>
                <Button icon={<SearchOutlined />}
                onClick={()=>{
                    setCity(document.querySelector("#inputfield").value);
                    if (city === "") {
                        setCity("tokyo");
                    }
                    setWeatherData(null);
                    fetchWeather();
                }}>検索</Button>
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