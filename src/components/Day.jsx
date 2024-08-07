import React from "react";
import "../styles/calendar/Day.scss";
import HappyImage from "../images/Happy.png";
import AngryImage from "../images/Angry.png";
import SadImage from "../images/Sad.png";
import SurprisedImage from "../images/Surprised.png";
import BoringImage from "../images/Boring.png";

const emotionColors = {
  "HAPPINESS": "#FFE75C",
  "ANGER":"#FF6262",
  "SADNESS": "#3293D7",
  "SURPRISE": "#FEBB00",
  "NEUTRAL":"#C6C6C6"
};

const Day = ({
  day,
  event,
  id,
  type,
  currentDate,
  setCurrentDate,
  getYearMonthDay,
  setClickDay,
  clickDay,
}) => {
  const onClick = () => {
    if (type !== "weekly") {
      setCurrentDate(day);
      setClickDay(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`day ${
        id === getYearMonthDay(currentDate) && clickDay ? "currentDay" : ""
      } ${
        currentDate.getMonth() + 1 !== parseInt(id.split("-")[1], 10)
          ? "invisible"
          : ""
      }`}
    >
      {day.getDate()}
      <div
        className={`${event ? "event" : ""}`}
        style={{ backgroundColor: emotionColors[event?.emotionType] }}
      ></div>
    </div>
  );
};

export default Day;
