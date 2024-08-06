import React from "react";
import Rolling from "../images/Rolling.gif";
import "../styles/Loading.scss";
const Loading = () => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <img src={Rolling} className="rolling"/>
      </div>
    </div>
  );
};

export default Loading;
