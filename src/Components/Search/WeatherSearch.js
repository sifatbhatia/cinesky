import React, { useState } from "react";
import debounce from "lodash-es/debounce";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import app from '../../firebase';
import NavBar from "../NavBar/NavBar";
import Search from "./Search";
import ForecastCard from "../ForcastCard";
import WeatherCard from "../WeatherCard";

const searchTimeoutInMs = 500;
const db = getFirestore(app);

export default function WeatherSearch() {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = React.useState("Eldoret");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [units] = React.useState("metric");

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
      postHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    getHistory();
  }, []);
  
  const postHistory = async () => {
    try {
      await addDoc(collection(db, 'searchHistory'), {
        location: location,
        timestamp: new Date()
      });
      getHistory();
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  const getHistory = async () => {
    try {
      const historyQuery = query(
        collection(db, 'searchHistory'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(historyQuery);
      const historyData = querySnapshot.docs.map((doc, index) => ({
        id: index + 1,
        location: doc.data().location,
        docId: doc.id
      }));
      setLocations(historyData);
    } catch (error) {
      console.error("Error getting history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'searchHistory'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setLocations([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <>
      <NavBar />
      <h1 className="container is-size-1 has-text-weight-bold">
        Weather Search
      </h1>
      <div className="min-h-screen">
        <main>
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
        </main>
        <div className="container">
          <h1 className="is-size-1">History</h1>
          <span 
            className="is-size-4" 
            onClick={clearHistory}
            style={{ cursor: 'pointer' }}
          > 
            Clear History × 
          </span> 
          <div>
            {locations.length ? (
              locations.map(({ id, location }) => (
                <ul className="container is-size-4" key={id}>
                  <li>{id}. {location}</li>
                </ul>
              ))
            ) : (
              <p className="is-size-3">No Weather History Yet :(</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


