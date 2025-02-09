import { Box, Container, Typography, Card } from "@mui/material";

export default function InfoBox({ info }) {
  const iconUrl = `https://openweathermap.org/img/wn/${info.icon}@2x.png`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      margin="10px"
    >
      <Typography variant="h3">
        {info.city}
        &nbsp;{info.country}
      </Typography>
      <Typography variant="body1">
        {new Date(info.date * 1000).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}
      </Typography>
      <Container
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "#d4d4d4",
            padding: "1rem",
            margin: "1rem",
            border: "2px dotted orangered",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <Box>
              <img src={iconUrl} alt={info.description} />
            </Box>
            <Typography variant="h3">{info.temp}&deg;C</Typography>
          </Card>
          <Card sx={{ margin: "10px 0 5px 0 " }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                padding: "2px 15px",
                color: "orangered",
                fontWeight: "600",
              }}
            >
              {" "}
              {info.weather}{" "}
              <strong style={{ color: "#121212 ", fontWeight: "400" }}>
                {" "}
                Feels like{" "}
              </strong>
              {info.feels_like}&deg;C
            </Typography>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 5px 5px 0",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Min Temp</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {" "}
                {info.temp_min}&deg;C
              </Typography>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 0 5px 5px ",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Max Temp</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {" "}
                {info.temp_max}&deg;C
              </Typography>
            </Card>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 5px 5px 0",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Sunrise</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {" "}
                {new Date(info.sunrise * 1000).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Typography>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 0 5px 5px ",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Sunset</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {new Date(info.sunset * 1000).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Typography>
            </Card>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 5px 5px 0",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Humidity</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {" "}
                {info.humidity}%
              </Typography>
            </Card>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                margin: "5px 0 5px 5px ",
                padding: "5px",
                flexGrow: "1",
              }}
            >
              <Typography variant="p"> Wind Speed</Typography>
              <Typography variant="body1" fontSize="1.5rem">
                {" "}
                {info.wind_speed}m/s
              </Typography>
            </Card>
          </Box>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              margin: "5px 0  ",
              padding: "5px",
              flexGrow: "1",
            }}
          >
            <Typography variant="p"> Visibility</Typography>
            <Typography variant="body1" fontSize="1.5rem">
              {" "}
              {info.visibility / 1000}KM
            </Typography>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
