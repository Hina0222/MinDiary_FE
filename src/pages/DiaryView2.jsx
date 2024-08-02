import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/DiaryView.scss";
import calendarImage from "../images/DiaryViewImage/Calendar.png";
import DiaryImage from "../images/DiaryViewImage/Diary.png";
import AnalyzeImage from "../images/DiaryViewImage/Analyze.png";

import CalendarPage from "../pages/CalendarPage";
import DiaryPage from "./DiaryPage";
import AnalyzePage from "./AnalyzePage";
import DiaryEntryPage from "./DiaryEntryPage";
import useTokenHandler from "../layout/Header/useTokenHandler";

import axios from "axios";
const CalendarView = () => {
  const { checkToken } = useTokenHandler();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeComponent, setActiveComponent] = useState("calendar");
  const [clickDay, setClickDay] = useState(false);
  const [eventBool, setEventBool] = useState(false);

  const onClick = (component) => {
    setActiveComponent(component);
    setClickDay(false);
  };
  useEffect(() => {
    // console.log("useEffect");

    const check_diary_month = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const year = 2024;
      const month = 8;
      // console.log("자료형", typeof year);
      checkToken();
      const config = {};
      try {
        const response = await axios.get("/api/v1/diary/month", {
          headers: {
            Authorization: `${accessToken}`,
          },
          params: {
            year: year,
            month: month,
          },
        });
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching diary data:", error);
      }
    };
    check_diary_month();
  }, []);

  return (
    <div className="diary-page">
      <aside className="sidebar">
        <button
          onClick={() => {
            onClick("diaryInput");
          }}
        >
          감정 일기 작성하기
        </button>
        <hr />
        <ul>
          <li
            className={activeComponent === "calendar" ? "activeLi" : ""}
            onClick={() => {
              onClick("calendar");
            }}
          >
            <img src={calendarImage} />
            달력
          </li>
          <li
            className={activeComponent === "diaryList" ? "activeLi" : ""}
            onClick={() => {
              onClick("diaryList");
            }}
          >
            <img src={DiaryImage} />
            작성한 감정 일기
          </li>
          <li
            className={activeComponent === "analyzeView" ? "activeLi" : ""}
            onClick={() => {
              onClick("analyzeView");
            }}
          >
            <img src={AnalyzeImage} />
            감정 분석 통계
          </li>
        </ul>
      </aside>

      {activeComponent === "calendar" && (
        <CalendarPage
          setCurrentDate={setCurrentDate}
          setEventBool={setEventBool}
          currentDate={currentDate}
          setClickDay={setClickDay}
          eventBool={eventBool}
          clickDay={clickDay}
        />
      )}

      {activeComponent === "diaryList" && (
        <DiaryPage
          setActiveComponent={setActiveComponent}
          setClickDay={setClickDay}
          setCurrentDate={setCurrentDate}
        />
      )}

      {activeComponent === "analyzeView" && <AnalyzePage />}

      {activeComponent === "diaryInput" && <DiaryEntryPage />}
    </div>
  );
};

export default CalendarView;
