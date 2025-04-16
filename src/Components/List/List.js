import React, { useState, useEffect } from "react";
import APIHelper from "../../API_CRUD.js";
import { ImCross } from "react-icons/im";
import "./WeatherList.css";
import Search from "../Search/Search";
import WeatherCard from "../WeatherCard";
import ForecastCard from "../ForcastCard";
import debounce from "lodash-es/debounce";
import NavBar from "../NavBar/NavBar";
const searchTimeoutInMs = 500;

function WeatherList() {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [date, setDate] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [units] = React.useState("metric");

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const locations = await APIHelper.getAllTodos();
      setLocations(locations);
    };
    fetchTodoAndSetTodos();
  }, []);

  const createTodo = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("please enter something");
      return;
    }
    if (locations.some(({ task }) => task === location)) {
      alert(`Task: ${location} already exists`);
      return;
    }
    const newTodo = await APIHelper.createTodo(location, weather, date);
    console.log(newTodo);
    setLocations([...locations, newTodo]);
  };
  const debounceSearch = React.useMemo(
    () =>
      debounce((searchTerm) => {
        setDebouncedSearchTerm(searchTerm);
      }, searchTimeoutInMs),
    []
  );

  const handleLocationChange = (event) => {
    const query = event.target.value.trim();
    if (query) {
      setIsSearching(true);
    }
    debounceSearch(query);
  };

 
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setLocation(debouncedSearchTerm);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await APIHelper.deleteTodo(id);
      setLocations(locations.filter(({ id: i }) => id !== i));
    } catch (err) {}
  };

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = {
      completed: !locations.find((todo) => todo.id === id).completed,
    };
    const updatedTodo = await APIHelper.updateTodo(id, payload);
    setLocations(
      locations.map((location) => (location.id === id ? updatedTodo : location))
    );
  };
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setLocation(debouncedSearchTerm);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <NavBar />
      <div>
        <h1 className="container is-size-1 has-text-weight-bold">
          Weather List
        </h1>
        <div className="mx-auto w-5/6 md:w-full 2xl:max-w-7xl xl:max-w-6xl">
          <Search
            location={location}
            isSearching={isSearching}
            onLocationChange={handleLocationChange}
          />
          <div className="shadow-lg rounded-lg h-auto overflow-hidden w-full md:w-3/5 lg:w-1/2 m-auto mt-4 divide-y-2 divide-light-blue-400">
            <WeatherCard location={location} units={units} />
            <ForecastCard location={location} units={units} />
          </div>
        </div>
        <div className="container">
          <h1 className="is-size-1">Todo</h1>
          <h2 className="is-size-2"> Add Weather Info </h2>
        </div>
        <section className="list">
          <div className="field is-grouped">
            <input
              className="input"
              type="text"
              value={location}
              onChange={({ target }) => setLocation(target.value)}
              placeholder="Enter a Location"
            />
            <input
              className="input"
              type="text"
              value={weather}
              onChange={({ target }) => setWeather(target.value)}
              placeholder="Enter a Weather"
            />
            <input
              className="input"
              type="text"
              value={date}
              onChange={({ target }) => setDate(target.value)}
              placeholder="Enter a Day"
            />
          </div>
          <button className="button is-link" onClick={createTodo}>
            Add
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Weather</th>
                <th>Date</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {locations.length ? (
                locations.map(
                  ({ id, location, weather, date, completed }, i) => (
                    <tr
                      key={i}
                      onClick={(e) => updateTodo(e, id)}
                      className={completed ? "completed" : ""}
                    >
                      <td>{location}</td>
                      <td>{weather} </td>
                      <td>{date}</td>
                      <td onClick={(e) => deleteTodo(e, id)}>
                        {" "}
                        <ImCross className="cross" />{" "}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tfoot className="is-size-3">No Saved Weather Yet: (</tfoot>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export default WeatherList;
