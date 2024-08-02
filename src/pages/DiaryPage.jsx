import React, { useEffect, useState } from "react";
import DiaryList from "../components/DiaryList";
import useTokenHandler from "../layout/Header/useTokenHandler";

import axios from "axios";

const DiaryPage = ({ setActiveComponent, setClickDay, setCurrentDate }) => {
  const { checkToken } = useTokenHandler();

  const [dummy, setDummy] = useState([
    // {
    //   dateAt: "2024-06-01",
    //   title: "여름의 한가운데에서 느낀 슬픔",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과1",
    //   content: "일기 내용1",
    // },
    // {
    //   dateAt: "2024-06-16",
    //   title: "여름의 한가운데에서 느낀 분노",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과2",
    //   content: "일기 내용2",
    // },
    // {
    //   dateAt: "2024-07-17",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: HappyImage,
    //   shortFeedback: "한 줄 감정 결과3",
    //   content: "일기 내용3",
    // },
    // {
    //   dateAt: "2024-07-20",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: SurprisedImage,
    //   shortFeedback: "한 줄 감정 결과4",
    //   content: "일기 내용4",
    // },
    // {
    //   dateAt: "2024-07-27",
    //   title: "여름의 한가운데에서 느낀 절망",
    //   emotionType: BoringImage,
    //   shortFeedback: "한 줄 감정 결과5",
    //   content: "일기 내용5",
    // },
  ]);

  // 작성한 모든 일기 불러오기
  useEffect(() => {
    const getAllDiaryDatas = async () => {
      try {
        checkToken();
        const res = await axios.get("/api/v1/diary/all", {
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        });
        // console.log(res.data);
        setDummy(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllDiaryDatas();
  }, []);

  return (
    <div className="main-container">
      <h1>MY EMOTIONAL DIARY</h1>
      <DiaryList
        diaryData={dummy}
        setDummy={setDummy}
        setClickDay={setClickDay}
        setCurrentDate={setCurrentDate}
        setActiveComponent={setActiveComponent}
      />
    </div>
  );
};

export default DiaryPage;
