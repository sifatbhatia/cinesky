import NavBar from "../NavBar/NavBar";
import React, { Component } from "react";
import apiKeys from "../../API";
import Clock from "react-live-clock";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import "./Home.css";
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
  color: "black",
  size: 112,
  animate: true,
};

class Home extends Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        //If user allow location service then will fetch data & send it to get-weather function.
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
          this.getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // tick = () => {
  //   this.getPosition()
  //   .then((position) => {
  //     this.getWeather(position.coords.latitude, position.coords.longitude)
  //   })
  //   .catch((err) => {
  //     this.setState({ errorMessage: err.message });
  //   });
  // }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      // sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),

      // sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
    });
    switch (this.state.main) {
      case "Haze":
        this.setState({ icon: "CLEAR_DAY" });
        break;
      case "Clouds":
        this.setState({ icon: "CLOUDY" });
        break;
      case "Rain":
        this.setState({ icon: "RAIN" });
        break;
      case "Snow":
        this.setState({ icon: "SNOW" });
        break;
      case "Dust":
        this.setState({ icon: "WIND" });
        break;
      case "Drizzle":
        this.setState({ icon: "SLEET" });
        break;
      case "Fog":
        this.setState({ icon: "FOG" });
        break;
      case "Smoke":
        this.setState({ icon: "FOG" });
        break;
      case "Tornado":
        this.setState({ icon: "WIND" });
        break;
      default:
        this.setState({ icon: "CLEAR_DAY" });
    }
  };

  render() {
    if (this.state.temperatureC) {
      return (
        <>
          <React.Fragment>
            <div>
              <NavBar />
            </div>
            <h1 className="container is-size-1 has-text-weight-bold">Home</h1>
            <h1 className="container is-size-2">
              Hello {localStorage.getItem("userName")}
            </h1>

            <div className="weather container">
              <div className="flex justify-center title">
                <h2>
                  {this.state.city}, {this.state.country}
                </h2>
              </div>
              <div className="">
                {" "}
                <ReactAnimatedWeather
                  icon={this.state.icon}
                  color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
                />
              </div>

              <div className="is-size-3 flex content-center self-center flex-col justify-center date-time">
                <h2>{this.state.main}</h2>
                <div className="flex  flex-col justify-center dmy">
                  <div id="txt"></div>
                  <div className=" flex  flex-col current-time">
                    <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                  </div>
                  <div className="flex  flex-col current-date">
                    {dateBuilder(new Date())}
                  </div>
                </div>
                <div className="flex flex-col  temperature">
                  <p>
                    {this.state.temperatureC}°<span>C</span>
                  </p>
                  {/* <span className="slash">/</span>
                {this.state.temperatureF} &deg;F */}
                </div>
              </div>
            </div>
          </React.Fragment>
        </>
      );
    } else {
      return (
        <React.Fragment>
          <div
         className="weather container" >
          <img
            alt="loader"
            src={loader}
            style={{ width: "50%", WebkitUserDrag: "none", filter:  "invert(100%)" }}
          />
          <h3 style={{ color: "black", fontSize: "32px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "black", marginTop: "10px", fontSize: "26px" }}>
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Home;
