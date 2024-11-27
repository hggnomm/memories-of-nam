import React from "react";
import "./ComingSoon.css";

const CommingSoon = () => {
  return (
    <div className="h-screen w-screen flex">
      <div className="card">
        <div className="header">
          <div className="logo">
            <a href=".">Nom.</a>
          </div>
        </div>
        <div className="content">
          <div className="title-holder">
            <h1>Get ready for the deployment.</h1>
            <p>
              Nom. đang tập trung phát triển con web này 😄😄 Vài ngày nữa sẽ có
              nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommingSoon;
