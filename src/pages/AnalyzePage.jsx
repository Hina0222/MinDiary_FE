import React, { useState, useCallback, useEffect } from "react";
import Chart from "../components/Chart";
import WeeklyCalendar from "../components/WeeklyCalendar";
import Emotion from "../components/Emotion";
import HappyImage from "../images/Happy.png";
import AngryImage from "../images/Angry.png";
import SadImage from "../images/Sad.png";
import SurprisedImage from "../images/Surprised.png";
import BoringImage from "../images/Boring.png";
import useTokenHandler from "../layout/Header/useTokenHandler";
import "../styles/AnalyzePage.scss";
import axios from "axios";

const AnalyzePage = () => {
  const { checkToken, config } = useTokenHandler();
  // 받아올 일기 정보들
  const [diaryDatas, setDiaryDatas] = useState([]);
  const [thisweekData, setThisweekData] = useState([]);

  // 지난 주 감정 데이터(더미)
  const [lastweekData, setLastweekData] = useState([]);

  // 감정 피드백 데이터
  const [feedbackData, setFeedbackData] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const checkSaturday = useCallback((date) => {
    if (date.getDay() === 6) {
      return String(date.getDate()).padStart(2, "0");
    } else {
      const sat = date.getDay();
      const diff = 6 - sat;
      return String(date.getDate() + diff).padStart(2, "0");
    }
  }, []);

  const getYearMonthDay_server = useCallback((date) => {
    const today = new Date(date); // 원래 날짜 객체를 복사하여 변경 사항이 원본에 영향을 주지 않도록 함
    const dayOfWeek = today.getDay();

    if (dayOfWeek !== 6) {
      const diff = 6 - dayOfWeek;
      today.setDate(today.getDate() + diff);
    }

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    console.log(`${year}-${month}-${day}`);

    return `${year}-${month}-${day}`;
  }, []);

  const getYearMonthDay = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const getFeedbackData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    checkToken();
    try {
      const date = getYearMonthDay_server(currentDate);
      const res = await axios.get(`/api/v1/weekly-emotion`, {
        headers: {
          Authorization: `${accessToken}`,
        },
        params: {
          endDate: date,
        },
      });
      setThisweekData([
        {
          id: "Happy",
          label: "기쁨",
          src: HappyImage,
          value: res.data.currentAvgHappiness,
          color: "#FFE75C",
        },
        {
          id: "Sad",
          label: "슬픔",
          src: SadImage,
          value: res.data.currentAvgSadness,
          color: "#3293D7",
        },
        {
          id: "Angry",
          label: "분노",
          src: AngryImage,
          value: res.data.currentAvgAnger,
          color: "#FF6262",
        },
        {
          id: "Surprised",
          label: "놀람",
          src: SurprisedImage,
          value: res.data.currentAvgSurprise,
          color: "#FEBB00",
        },
        {
          id: "Boring",
          label: "중립",
          src: BoringImage,
          value: res.data.currentAvgNeutral,
          color: "#C6C6C6",
        },
      ]);

      setLastweekData([
        {
          id: "Happy",
          label: "기쁨",
          src: HappyImage,
          value: res.data.prevAvgHappiness,
          color: "#FFE75C",
        },
        {
          id: "Sad",
          label: "슬픔",
          src: SadImage,
          value: res.data.prevAvgSadness,
          color: "#3293D7",
        },
        {
          id: "Angry",
          label: "분노",
          src: AngryImage,
          value: res.data.prevAvgAnger,
          color: "#FF6262",
        },
        {
          id: "Surprised",
          label: "놀람",
          src: SurprisedImage,
          value: res.data.prevAvgSurprise,
          color: "#FEBB00",
        },
        {
          id: "Boring",
          label: "중립",
          src: BoringImage,
          value: res.data.prevAvgNeutral,
          color: "#C6C6C6",
        },
      ]);
      setFeedbackData(res.data.currentWeeklyDetailedFeedback); //주간 피드백
    } catch (err) {
      console.log(err);
    }
  };

  const getDiaryDatas = async () => {
    try {
      checkToken();
      const res = await axios.get(`/api/v1/diary/month`, {
        params: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        },
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      setDiaryDatas(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeedbackData();
    getDiaryDatas();
  }, [currentDate]);

  useEffect(() => {
    if (feedbackData.length === 0) {
      setFeedbackData("이번주 주간 피드백 데이터가 아직 준비되지 않았아요!");
    }
  }, [feedbackData]);

  return (
    <div className="main-container">
      <h1>EMOTION ANALYSIS</h1>
      <div className="analysis-container">
        <div className="chart-container">
          <Chart data={thisweekData} isThisWeek={true} />
          <Chart data={lastweekData} isThisWeek={false} />
        </div>
        <div className="weekly-container">
          <div className="weekly-calendar-container">
            <WeeklyCalendar
              dummy={diaryDatas}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              getYearMonthDay={getYearMonthDay}
              viewMode={"week"}
            />
          </div>
          <div className="feedback-content">
            <div className="feedback-title">
              <div>AI 주간 감정 피드백</div>
            </div>
            <Emotion emotionData={thisweekData} type="weekly" />
            <div className={`feedback-scroll ${feedbackData.length < 50 ? "oneline" : ""}`}>
              <div>{feedbackData}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
