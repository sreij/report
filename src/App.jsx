import { useState, useEffect } from "react";
import { SearchOutlined, AimOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Footer from "./Footer"

async function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`/.netlify/functions/getLocation?lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                return data.placeName;
            } catch (error) {
                console.error('Error fetching place name:', error);
                return 'Error fetching place name';
            }
        }, (error) => {
            console.error('Error getting location:', error);
            return 'Error getting location';
        });
    } else {
        return 'Geolocation not supported';
    }
}

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Tokyo');
    const key = '7eb57afc13ef435abae92509242912';

    const fetchWeather = async (city) => {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    return (
        <div>
            <div>
                <label>天気を検索</label>
                <input id="inputfield" placeholder="場所"></input>
                <Button icon={<SearchOutlined />}
                    onClick={async () => {
                        const newCity = document.querySelector("#inputfield").value;
                        if (newCity === "") {
                            setCity("Tokyo");
                        } else {
                            setCity(newCity);
                        }
                        setWeatherData(null);
                        await fetchWeather(newCity);
                    }}>
                    検索
                </Button>
                <Button icon={<AimOutlined />}
                    onClick={async () => {
                        const location = await fetchLocation();
                        setCity(location);
                        setWeatherData(null);
                        await fetchWeather(location);
                    }}>
                    現在地
                </Button>
            </div>
            <div>
                <main>
                    <h1>Weather in {city}</h1>
                    <p>Update time: {weatherData.current.last_updated}</p>
                    <p>Temperature: {weatherData.current.temp_c}°C</p>
                    <p>Wind: {weatherData.current.wind_kph} kph</p>
                    <p>Description: {weatherData.current.condition.text}</p>
                </main>
                {/* 
                    <aside>
                        <h2>Forecast:</h2>
                        <ul> {weatherData.forecast.map((day, index) => (
                            <li key={index}>
                                Day {day.day}: Temperature: {day.temperature}, Wind: {day.wind}
                            </li>
                        ))}
                        </ul>
                    </aside>
                    */}
            </div>
            <Footer />
        </div>
    );
}