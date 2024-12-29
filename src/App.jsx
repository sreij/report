import { useState, useEffect } from "react";
import { SearchOutlined, AimOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Footer from "./Footer"

async function fetchLocation(){
    let placeName;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`/.netlify/functions/getLocation?lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                placeName = data.placeName;
            } catch (error) {
                console.error('Error fetching place name:', error);
                placeName = 'Error fetching place name';
            }
        }, (error) => {
            console.error('Error getting location:', error);
            placeName = 'Error getting location';
        });
    } else {
        placeName = 'Geolocation not supported';
    }
    return placeName;
}

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('tokyo');
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
        const location = async () => {
            setCity(await fetchLocation());
            setWeatherData(null);
            fetchWeather();
        };
        location();
    }, []);

    return (
        <div>
            <div>
                <label>天気を検索</label>
                <input id="inputfield" placeholder="場所"></input>
                <Button icon={<SearchOutlined />}
                    onClick={() => {
                        setCity(document.querySelector("#inputfield").value);
                        if (city === "") {
                            setCity("tokyo");
                        }
                        setWeatherData(null);
                        fetchWeather();
                    }}>
                    検索
                </Button>
                <Button icon={<AimOutlined />}
                    onClick={()=>{
                        location();
                    }}>
                    現在地
                </Button>
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