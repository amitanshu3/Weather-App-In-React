import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const api = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "0fb743baa00563ab3020169211bb01c4";

  const [searchValue, setSearchValue] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  // Load weather data and search value from local storage on component mount
  useEffect(() => {
    const savedWeatherData = localStorage.getItem("weatherData");
    const savedSearchValue = localStorage.getItem("searchValue");

    if (savedWeatherData) {
      setWeatherData(JSON.parse(savedWeatherData));
    }

    if (savedSearchValue) {
      setSearchValue(savedSearchValue);
    }
  }, []);

  // Save weather data to local storage whenever it changes
  useEffect(() => {
    if (weatherData) {
      localStorage.setItem("weatherData", JSON.stringify(weatherData));
    }
  }, [weatherData]);

  // Save search value to local storage whenever it changes
  const handleSearchBox = (e) => {
    setSearchValue(e.target.value);
    localStorage.setItem("searchValue", e.target.value);
  };

  const handleClick = () => {
    if (searchValue.trim() !== "") {
      fetchWeatherData();
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${api}?units=metric&q=${searchValue}&appid=${apiKey}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeatherData(data);
      console.log(data);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      alert("Invalid City Name");
    }
  };

  return (
    <div className='bg-slate-900 border flex justify-center items-center h-screen flex-col'>
        <h1 className='text-white m-7'>{Date()}</h1>
      <div className='bg-blue-800 w-auto rounded-lg min-h-80 text-white'>
        <div className='flex flex-row p-2'>
          <input
            type="search"
            value={searchValue}
            onChange={handleSearchBox}
            placeholder='Search A City Name'
            className='border border-black px-2 py-1 rounded-lg text-black'
          />
          <img
            className='w-8 cursor-pointer ml-2 rounded-lg'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXxCpvi5pRBlHmCvYtvVaVK9w0EQnV2jRES57Qo7bBXiq1kdZsUBgO63ng9z3inrP9Rmo&usqp=CAU"
            alt="search"
            onClick={handleClick}
          />
        </div>
        {weatherData && (
          <div className="mt-4 flex justify-center items-center flex-col">
            <h2 className="text-xl font-semibold m-1">Location Name - {weatherData.name}, {weatherData.sys.country}</h2>
            <p className="text-lg m-1">{weatherData.weather[0].description}</p>
            <p className="text-3xl font-bold m-1">{Math.round(weatherData.main.temp)}°C</p>
            <p className='text-2xl font-bold m-1'>{weatherData.wind.speed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
