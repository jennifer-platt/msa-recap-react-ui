import React from "react";
import { useParams } from "react-router-dom";

function Feedback() {

  let { slug } = useParams();

  return (
    <div className="about">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-5">
            <h1 className="font-weight-light">Feedback</h1>
            <p>
              Feedback for video {slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;