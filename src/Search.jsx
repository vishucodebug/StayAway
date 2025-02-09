import { Box, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Button from "@mui/material/Button";

import { useEffect, useState } from "react";

export default function Search({ upDateInfo, onFirstUpdate }) {
  let [city, setCity] = useState("Lucknow");
  let [error, setError] = useState(false);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_Key = "64363ee0fc46e4a442f7fbe4e27c7a9d";

  const getWeatherInfo = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      let res = await fetch(
        `${API_URL}?q=${city}&appid=${API_Key}&units=metric`
      );
      let jsonRes = await res.json();
      // console.log(jsonRes);
      let result = {
        temp: jsonRes.main.temp,
        feels_like: jsonRes.main.feels_like,
        humidity: jsonRes.main.humidity,
        temp_max: jsonRes.main.temp_max,
        temp_min: jsonRes.main.temp_min,
        sea_level: jsonRes.main.sea_level,
        city: jsonRes.name,
        country: jsonRes.sys.country,
        sunrise: jsonRes.sys.sunrise,
        sunset: jsonRes.sys.sunset,
        date: jsonRes.dt,
        visibility: jsonRes.visibility,
        wind_speed: jsonRes.wind.speed,
        weather: jsonRes.weather[0].description,
        icon: jsonRes.weather[0].icon,
      };
      // console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  };

  let handleChange = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    async function getFirstUpdate() {
      try {
        let response = await getWeatherInfo();
        onFirstUpdate(response);
      } catch (err) {
        setError(true);
      }
    }
    getFirstUpdate();
  }, []);

  let handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setCity("");
      let newInfo = await getWeatherInfo();
      upDateInfo(newInfo);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box display="inline-block">
        <form onSubmit={handleSubmit}>
          <TextField
            id="city"
            label="City Name"
            variant="standard"
            onChange={handleChange}
            value={city}
            required
            color="warning"
          />

          <Button type="submit">
            <SearchIcon color="warning" sx={{ fontSize: "3rem" }} />
          </Button>
        </form>
      </Box>
      <p style={{ color: "red", margin: "0px" }}>
        {" "}
        {error && <p>No Such place exits</p>}
      </p>
    </Box>
  );
}
