import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props:any) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Recap - A microservices demo by Michael Saunby
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/feedback" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/feedback">
                  Feedback
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/viewer" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/viewer">
                  Viewer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);