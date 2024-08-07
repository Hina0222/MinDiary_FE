import React, { useState, useCallback, useEffect } from "react";
import Chart from "../components/Chart";
import WeeklyCalendar from "../components/WeeklyCalendar";
import Emotion from "../components/Emotion";
import HappyImage from "../images/Happy.png";
import AngryImage from "../images/Angry.png";
import SadImage from "../images/Sad.png";
import SurprisedImage from "../images/Surprised.png";
import BoringImage from "../images/Boring.png";
import axios from "axios";
import useTokenHandler from "../layout/Header/useTokenHandler";

const AnalyzePage = () => {
  const { checkToken, config } = useTokenHandler();
  // 받아올 일기 정보들
  const [diaryDatas, setDiaryDatas] = useState([]);
  const [thisweekData, setThisweekData] = useState(
    [
    // { id: "Happy", label: "기쁨", value: 0, color: "#FFE75C" },
    // { id: "Sad", label: "슬픔", value: 0, color: "#3293D7" },
    // { id: "Angry", label: "분노", value: 0, color: "#FF6262" },
    // { id: "Surprised", label: "놀람", value: 0, color: "#FEBB00" },
    // { id: "Boring", label: "중립", value: 0, color: "#C6C6C6" },
  ]
);

  // 지난 주 감정 데이터(더미)
  const [lastweekData, setLastweekData] = useState(
    [
    // { id: "Happy", label: "기쁨", value: 30, color: "#FFE75C" },
    // { id: "Sad", label: "슬픔", value: 2, color: "#3293D7" },
    // { id: "Angry", label: "분노", value: 15, color: "#FF6262" },
    // { id: "Surprised", label: "놀람", value: 5, color: "#FEBB00" },
    // { id: "Boring", label: "중립", value: 20, color: "#C6C6C6" },
  ]
);

  // 감정 피드백 데이터
  const [feedbackData, setFeedbackData] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickDay, setClickDay] = useState(false);

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
      const date = getYearMonthDay(currentDate);
      console.log(date);
      const res = await axios.get(`/api/v1/weekly-emotion`, {
        headers: {
          Authorization: `${accessToken}`,
        },
        params: {
          endDate: date,
        },
      });
      console.log(res);
      setThisweekData([
        { id: "Happy", label: "기쁨", value: res.data.currentAvgHappiness, color: "#FFE75C" },
        { id: "Sad", label: "슬픔", value: res.data.currentAvgHappiness, color: "#3293D7" },
        { id: "Angry", label: "분노", value: res.data.currentAvgHappiness, color: "#FF6262" },
        { id: "Surprised", label: "놀람", value: res.data.currentAvgHappiness, color: "#FEBB00" },
        { id: "Boring", label: "중립", value: res.data.currentAvgHappiness, color: "#C6C6C6" },
      ])

      setLastweekData([
        { id: "Happy", label: "기쁨", value: res.data.prevAvgHappiness, color: "#FFE75C" },
        { id: "Sad", label: "슬픔", value: res.data.prevAvgHappiness, color: "#3293D7" },
        { id: "Angry", label: "분노", value: res.data.prevAvgHappiness, color: "#FF6262" },
        { id: "Surprised", label: "놀람", value: res.data.prevAvgHappiness, color: "#FEBB00" },
        { id: "Boring", label: "중립", value: res.data.prevAvgHappiness, color: "#C6C6C6" },
      ])
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
      const diaryData = res.data.map((entry) => ({
        diaryAt: entry.diaryAt,
        emotionType: entry.emotionType,
      }));
      setDiaryDatas(diaryData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentDate.getDay === 6) {
      // 6 represents Saturday
      getFeedbackData();
    } else {
      setFeedbackData("이번주 주간 피드백 데이터가 아직 준비되지 않았아요!");
    }
    getDiaryDatas();
  }, []);

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
              setClickDay={setClickDay}
              clickDay={clickDay}
              viewMode={"week"}
            />
          </div>
          <div className="feedback-content">
            <div className="feedback-title">주간 감정 피드백</div>
            <Emotion emotionData={thisweekData} type="weekly" />
            <p>{feedbackData}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
