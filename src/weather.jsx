import Search from "./Search";
import InfoBox from "./infoBox";
import { useState } from "react";
import "./assets/weather.css";

import { Container, Box } from "@mui/material";

export default function WeatherApi() {
  let [weatherInfo, setWeatherInfo] = useState({});

  let upDateInfo = (result) => {
    setWeatherInfo(result);
  };

  //from useEffect
  let handleFirstUpdate = (data) => {
    setWeatherInfo(data);
  };
  return (
    <Box className="homePage">
      <Container
        sx={{
          margin: "10px",
          maxWidth: "35rem",
        }}
      >
        <Box className="InfoCard">
          <Search upDateInfo={upDateInfo} onFirstUpdate={handleFirstUpdate} />
          <InfoBox info={weatherInfo} />
        </Box>
      </Container>
    </Box>
  );
}
