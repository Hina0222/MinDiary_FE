import React, { useEffect, useState } from "react";
import DateSelect from "../components/DateSelect";
import Emotion from "../components/Emotion";
import HappyImage from "../images/Happy.png";
import AngryImage from "../images/Angry.png";
import SadImage from "../images/Sad.png";
import SurprisedImage from "../images/Surprised.png";
import BoringImage from "../images/Boring.png";
import SelectHappyImage from "../images/Select_Happy.png";
import SelectAngryImage from "../images/Select_Angry.png";
import SelectSadImage from "../images/Select_Sad.png";
import SelectSurprisedImage from "../images/Select_Surprised.png";
import SelectBoringImage from "../images/Select_Boring.png";
import InputForm from "../components/InputForm";
import useTokenHandler from "../layout/Header/useTokenHandler";
import Loading from "../components/Loading";
import "../styles/DiaryEntryPage.scss";

import axios from "axios";
import { set } from "date-fns";

const DiaryEntryPage = () => {
  const { checkToken, config } = useTokenHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [diaryDatas, setDiaryDatas] = useState([]);

  //감정 이미지 경로
  const emotionImages = {
    행복: { normal: HappyImage, selected: SelectHappyImage },
    분노: { normal: AngryImage, selected: SelectAngryImage },
    슬픔: { normal: SadImage, selected: SelectSadImage },
    놀람: { normal: SurprisedImage, selected: SelectSurprisedImage },
    중립: { normal: BoringImage, selected: SelectBoringImage },
  };

  // 일기 작성 가능한 날짜
  const [missingDays, setMissingDays] = useState([]);

  // 선택한 날짜
  const [currentDate, setCurrentDate] = useState(new Date());

  // 감정 데이터(지우면 안됨)
  const [emotionData, setEmotionData] = useState([
    {
      id: "HAPPINESS",
      emotion: "행복",
    },
    {
      id: "ANGER",
      emotion: "분노",
    },
    {
      id: "SADNESS",
      emotion: "슬픔",
    },
    {
      id: "SURPRISE",
      emotion: "놀람",
    },
    {
      id: "NEUTRAL",
      emotion: "중립",
    },
  ]);

  // 선택한 이미지
  const [selectEmotion, setSelectEmotion] = useState("");

  // 제목
  const [title, setTitle] = useState("");

  // 내용
  const [content, setContent] = useState("");

  // 감정 이미지 경로 확인
  const checkEmotion = (emotion) => {
    return emotionImages[emotion]?.selected || "";
  };

  useEffect(() => {
    // console.log(selectEmotion);
    setEmotionData(
      emotionData.map((data) => {
        if (data.id === selectEmotion) {
          return {
            ...data,
            src: checkEmotion(data.emotion),
          };
        }
        return {
          ...data,
          src: emotionImages[data.emotion].normal,
        };
      })
    );
  }, [selectEmotion]);

  const postDiary = async () => {
    const date = formatDate(currentDate);
    const diaryEntry = diaryDatas.find((entry) => entry.diaryAt === date);
    if (missingDays.length == 0) {
      alert("이번주 일기를 전부 작성하셨습니다.");
      return;
    } else if (diaryEntry) {
      alert("오늘 일기를 작성하셨습니다.");
      return;
    }

    if (!selectEmotion) {
      alert("감정을 선택해주세요.");
      return;
    } else if (title.length < 10) {
      alert("제목을 10자 이상 입력해주세요.");
      return;
    } else if (content.length < 30) {
      alert("내용을 30자 이상 입력해주세요.");
      return;
    }
    try {
      checkToken();
      setIsLoading(true);
      const res = await axios.post(
        `/api/v1/diary`,
        {
          diaryAt: currentDate,
          title: title,
          content: content,
          emotionType: selectEmotion,
        },
        config
      );
      if (res.status === 201) {
        setIsLoading(false);
        alert("일기 작성이 완료되었습니다.");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      alert("감정 분석에 실패했습니다. 다시 작성해주세요.");
    }
  };

  const findMissingDays = async () => {
    try {
      checkToken();
      // console.log("findMissingDays");
      const res = await axios.get(`/api/v1/diary/missing-days`, config);
      // console.log(res);
      setMissingDays(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1, 두 자리 수로 만듦
    const day = String(date.getDate()).padStart(2, "0"); // 두 자리 수로 만듦
    return `${year}-${month}-${day}`;
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
    findMissingDays();
    getDiaryDatas();
  }, []);

  useEffect(() => {
    if (missingDays.length > 1) {
      const todayFormatted = formatDate(new Date());

      if (!missingDays.includes(todayFormatted)) {
        setCurrentDate(new Date(missingDays[missingDays.length - 1]));
      }
    }
  }, [missingDays]);

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div className="main-container" style={{ width: "1063px" }}>
        <div className="title">
          <h1>WRITE AN EMOTIONAL DIARY</h1>
          <button className="submit-button" onClick={() => postDiary()}>
            일기 작성 완료
          </button>
        </div>
        <div className="top-content">
          <DateSelect
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            includeDates={missingDays}
          />
          <div className="emotion">
            <label>오늘의 감정</label>
            <Emotion
              emotionData={emotionData}
              type="input"
              setEmotion={setSelectEmotion}
            />
          </div>
        </div>
        <InputForm
          label="제목"
          placeholder="제목을 입력해주세요."
          value={title}
          setValue={setTitle}
        />
        <InputForm
          label="내용"
          placeholder="내용을 입력해주세요. 일기 내용이 짧으면 감정 분석이 어려울 수 있어요!"
          value={content}
          setValue={setContent}
        />
      </div>
    </>
  );
};

export default DiaryEntryPage;
