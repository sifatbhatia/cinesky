/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

function NavBar() {
  var change = () => {
    var button = document.querySelectorAll(".navbar-burger", 0);
    if (button.length > 0) {
      button.forEach((el) => {
        el.addEventListener("click", () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" className on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("is-active");
          $target.classList.toggle("is-active");
        });
      });
    }
  };
  const invertColors = (e) => {
    document.documentElement.classList.toggle("dark-mode");
  };
  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/home">
          <img src="https://i.ibb.co/6Wpg4kY/dsa.png" alt="logo" />
        </a>

        <a
          onClick={change}
          alt="button"
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a href="/home" className="navbar-item">
            Home
          </a>

          <a href="/mapview" className="navbar-item">
            Mapview
          </a>
          <a href="/list" className="navbar-item">
            Weather list
          </a>
          <a href="/search" className="navbar-item">
            Search
          </a>
        </div>

        <div className="navbar-end">
          <a href="/about" className="navbar-item">
            About
          </a>
          <a href="/contact" className="navbar-item">
            Contact
          </a>
          <a className="navbar-item">
            <img
              alt="invert"
              onClick={invertColors}
              className="image"
              src="https://www.svgrepo.com/show/223639/moon-phases-half-moon.svg"
              width="50"
              height="50"
            />
          </a>
          <div className="navbar-item">
            <div className="buttons">
              <a href="/" className="button is-dark">
                Log Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
