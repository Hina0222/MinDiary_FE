import React, { useState, useCallback, useEffect } from "react";
import Calendar from "../components/Calendar";
import DiaryInfo from "../components/DiaryInfo";
import DiarySummaryList from "../components/DiarySummaryList";
import useTokenHandler from "../layout/Header/useTokenHandler";

import axios from "axios";

const CalendarPage = ({
  currentDate,
  setEventBool,
  setCurrentDate,
  setClickDay,
  clickDay,
  eventBool,
}) => {
  const { checkToken } = useTokenHandler();

  const [dummy, setDummy] = useState([
    // {
    //   dateAt: "2024-06-01",
    //   title: "여름의 한가운데에서 느낀 슬픔",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과1",
    // },
    // {
    //   dateAt: "2024-06-16",
    //   title: "여름의 한가운데에서 느낀 분노",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과2",
    // },
    // {
    //   dateAt: "2024-07-17",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과3",
    // },
    // {
    //   dateAt: "2024-07-20",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: SurprisedImage,
    //   shortFeedback: "한 줄 감정 결과4",
    // },
    // {
    //   dateAt: "2024-07-27",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: BoringImage,
    //   shortFeedback: "한 줄 감정 결과5",
    // },
  ]);

  // 한달치 일기 불러오기
  useEffect(() => {
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
        setDummy(res.data);
        // console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getDiaryDatas();
  }, [currentDate.getMonth()]);

  const getYearMonthDay = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const id = getYearMonthDay(currentDate);

  const checkEvent = useCallback(
    (id) => {
      return dummy.find((item) => item.diaryAt === id)?.diaryId;
    },
    [dummy]
  );

  useEffect(() => {
    const event = checkEvent(id);
    setEventBool(event);
  }, [id, checkEvent]);

  return (
    <div className="main-container">
      <h1>CALENDAR</h1>
      <div className="main-content1">
        <Calendar
          dummy={dummy}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          getYearMonthDay={getYearMonthDay}
          setClickDay={setClickDay}
          clickDay={clickDay}
          viewMode={"month"}
        />

        {eventBool && clickDay ? (
          <div className="dayDiaryInfo-container">
            <DiaryInfo
              id={id}
              diaryData={dummy}
              setDummy={setDummy}
              setClickDay={setClickDay}
              diaryId={checkEvent(id)}
            />
          </div>
        ) : (
          <DiarySummaryList
            diaryData={dummy}
            setDummy={setDummy}
            setClickDay={setClickDay}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
