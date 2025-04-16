import React  from 'react';
import NavBar from "../NavBar/NavBar";

function About() {
  return (
    <>
      <NavBar />
      <div className="container">
        <h1 className="title is-size-1">About</h1>
       
      </div>
      <div className="Info">
          <img
            alt="img"
            src="https://i.postimg.cc/8kmtgHtV/2021-03-28.jpg"
            width="400px"
          ></img>
          <h2 className="is-size-2">Sifat Bhatia</h2>
          <div className="padding">
          <p className=" is-size-3">I am a web designer and developer and soon to be a graduate from fullsail university.
          Looking forward to what future brings.
          This is Filmther, one of most refined project. I wanted to soemthing more with it. Maybe, I will push out updates in the future.</p>
          </div>
          
        </div>
    </>
  );
}

export default About;
