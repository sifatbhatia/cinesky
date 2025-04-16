import React, { Component } from "react";
import NavBar from "../NavBar/NavBar";
import "./MapView.css";
class MapView extends Component {
  render() {
    return (
      <>
      
        <NavBar />
        <h1 className="container is-size-1 has-text-weight-bold">Map View</h1>

        <div className="map">
          <iframe
            title="Map"
            width="650"
            height="450"
            src="https://embed.windy.com/embed2.html?lat=37.090&lon=-107.227&detailLat=43.115&detailLon=-107.210&width=650&height=450&zoom=4&level=surface&overlay=wwaves&product=ecmwfWaves&menu=&message=true&marker=true&calendar=24&pressure=true&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
            frameBorder="0"
          ></iframe>
        </div>
      </>
    );
  }
}

export default MapView;
