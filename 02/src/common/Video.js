import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ReactComponent as Forward } from "../image/ic_forward_10.svg";
import { ReactComponent as Backward } from "../image/ic_backward_10.svg";
import { ReactComponent as Play } from "../image/ic_play.svg";
import { ReactComponent as Pause } from "../image/ic_pause.svg";
import { ReactComponent as ScreenFull } from "../image/ic_screen_full.svg";
import { ReactComponent as ScreenSmall } from "../image/ic_screen_small.svg";

// 백엔드 서버에서 데이터 가져오는 것으로 가정
async function getVideoInfo() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        title: "Big Buck Bunny",
        opening: [0, 30],
        ending: [490, 580],
    };
    return data;
}

function Video() {
    const [videoInfo, setVideoInfo] = useState({
        url: null,
        title: null,
        opening: null,
        ending: null,
    });
    const [nowPlaying, setNowPlaying] = useState(false);
    const [screenFull, setScreenFull] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [showControl, setShowControl] = useState(true);
    const [openTime, setOpenTime] = useState([0, 0]);
    const [endTime, setEndTime] = useState([0, 0]);
    const [openSkip, setOpenSkip] = useState(false);
    const [endSkip, setEndSkip] = useState(false);
    const [test, setTest] = useState("transparent");

    const videoSelector = useRef(null);
    const videoElement = videoSelector.current;
    const videoContainer = useRef(null);
    const videoContainElem = videoContainer.current;
    const inputElem = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryStringTime = searchParams.get("t");

    // [dev] 시, 분, 초 나누는 함수 - 현재 과제의 재생시간은 1시간이 넘지 않지만 넘는 경우도 고려해서 함수를 설계
    const splitMinutesSeconds = (time) => {
        const minutes = parseInt(time / 60);
        const seconds = parseInt(time % 60);
        const hours = parseInt(minutes / 60);
        return { hours, minutes, seconds };
    };

    const { hours: currentHours, minutes: currentMinutes, seconds: currentSeconds } = splitMinutesSeconds(currentTime);
    const { hours: totalHours, minutes: totalMinutes, seconds: totalSeconds } = splitMinutesSeconds(videoDuration);
    const percentNum = (currentTime / videoDuration || 0) * 100;

    // 비동기 통신을 통해 데이터를 호출하는 함수
    const getResult = async () => {
        const data = await getVideoInfo();
        setVideoInfo(data);
    };

    let timer;
    // 비디오 화면에서 마우스가 움직이면 setTimeout 해제를 위해 공통으로 선언
    const clearTime = () => {
        clearTimeout(timer);
    };

    const onMouseEnterShow = () => {
        clearTime();
        if (showControl === false) {
            setShowControl(true);
        }
    };

    // 비디오 화면에서 마우스가 벗어나는 경우
    const onMouseLeaveHide = () => {
        if (showControl === true) {
            timer = setTimeout(() => {
                setShowControl(false);
            }, 3000);
        }
    };

    // 비디오 오버레이 컨트롤 - 오버레이 영역에서 움직일 경우 보여지고, 빨간 영역 외부에서 움직임이 없을 때 3초 뒤 사라짐
    const onMouseMoveShow = () => {
        clearTime();
        timer = setTimeout(() => {
            setShowControl(false);
        }, 3000);
    };

    // [dev] 재생 함수는 1가지 함수로 구현하는 것이 좋으나 기능 자체가 커질 일이 없고 Toggle 기능 외에는 변경사항이 없어 보이기 때문에 한가지로 작성
    const onPlayClick = () => {
        if (videoElement) {
            if (nowPlaying) {
                setNowPlaying(false);
                videoElement.pause();
            } else {
                setNowPlaying(true);
                videoElement.play();
            }
        }
    };

    // [dev] 전체화면 on/off 는 1가지 함수로 구현하는 것이 좋으나 기능 자체가 커질 일이 없고 Toggle 기능 외에는 변경사항이 없어 보이기 때문에 한가지로 작성
    const onFullClick = () => {
        if (screenFull) {
            setScreenFull(false);
            document.exitFullscreen();
        } else {
            videoContainElem.requestFullscreen();
            setScreenFull(true);
        }
    };

    // 동영상 현재 시간 업데이트
    const timeUpdate = () => {
        const updateVideoElement = videoSelector && videoSelector.current;
        if (updateVideoElement) {
            updateVideoElement.addEventListener("timeupdate", function () {
                setCurrentTime(updateVideoElement.currentTime);
            });
        }
    };

    // [dev] 오프닝 / 엔딩 Skip 버튼 함수를 2개를 1개로 만들 것도 고민해봤지만 추후에 Skip버튼의 정책 변경 등을 고려하여 1가지 함수는 한가지 기능만 담당하는 것이 좋다고 판단하여 1개씩 구현
    const onSkipClick = () => {
        if (videoInfo.opening != null) {
            const [openingStart, openingEnd] = videoInfo.opening;
            videoElement.currentTime = openingEnd;
            setCurrentTime(openingEnd);
        }
    };

    const onEndSkipClick = () => {
        if (videoInfo.ending != null) {
            const [endingStart, endingEnd] = videoInfo.ending;
            videoElement.currentTime = endingEnd;
            setCurrentTime(endingEnd);
        }
    };

    // [dev] 앞, 뒤로 10초 움직이는 것을 1가지의 함수로 만들 것도 고민해봤지만 1가지 함수는 한가지 기능만 담당하는 것이 좋다고 판단하여 1개씩 구현
    // 뒤로 10초 재생 구간 변경 함수
    const onBackwardClick = () => {
        let timeDuration = -10;
        videoElement.currentTime += timeDuration;
        setCurrentTime(videoElement.currentTime);
    };

    // 앞으로 10초 재생 구간 변경 함수
    const onForwardClick = (state) => {
        let timeDuration = 10;
        videoElement.currentTime += timeDuration;
        setCurrentTime(videoElement.currentTime);
    };

    // progress바 정보에 따라 현재 재생시간을 반영하는 함수
    const onProgressChange = (percent) => {
        if (videoElement) {
            const playingTime = videoElement.duration * (percent / 100);
            videoElement.currentTime = playingTime;
            setCurrentTime(playingTime);
        }
    };

    useEffect(() => {
        if (videoInfo.opening != null && videoInfo.ending != null) {
            const { opening, ending } = videoInfo;
            setOpenTime(opening);
            setEndTime(ending);
        }
    }, [videoInfo]);

    useEffect(() => {
        const [openingStart, openingEnd] = openTime;
        const [endingStart, endingEnd] = endTime;

        // [dev] opening 배열은 있어도, ending 배열은 없는 경우가 발생할 수도 있기에 추후 유지보수를 위해 스킵 버튼에 대한 상태 관리는 나눠서 구현
        if (openingStart !== openingEnd) {
            if (currentTime <= openingEnd && currentTime >= openingStart) {
                setOpenSkip(true);
            } else {
                setOpenSkip(false);
            }
        }

        if (endingStart !== endingEnd) {
            if (currentTime >= endingStart && currentTime <= endingEnd) {
                setEndSkip(true);
            } else {
                setEndSkip(false);
            }
        }
    }, [currentTime]);

    // [dev] 비디오 오버레이의 상태가 언마운트 될 때 setTimeout 정리가 필요로 인해 코드 작성
    useEffect(() => {
        return () => {
            clearTime();
        };
    }, [showControl]);

    useEffect(() => {
        getResult();
        timeUpdate();
        // 비디오 재생 가능 상태가 되면 비디오 전체시간, 현재 시간 설정
        const checkVideoState = setInterval(() => {
            if (videoSelector.current.readyState > 0) {
                console.log("비디오 사용이 가능합니다.");
                clearInterval(checkVideoState);
                setVideoDuration(videoSelector.current.duration);

                // [dev] queryString이 존재하고 전체 비디오 시간보다 작으면 현재 시간에 맞게 반영
                if (queryStringTime && videoSelector.current.duration > queryStringTime) {
                    videoSelector.current.currentTime = queryStringTime;
                    setCurrentTime(queryStringTime);
                } else {
                    // [dev] queryString이 존재하지 않거나, 초과하는 경우는 처음부터 재생
                    console.log("queryStringTime이 없거나 초과해서 처음부터 재생합니다.");
                }
            } else {
                console.log("비디오 준비중 입니다.");
            }
        }, 500);
    }, []);

    // [dev] 해당 영역은 동영상 컨트롤러 확인용 테스트 버튼 입니다.
    const changeColor = () => {
        if (test === "transparent") {
            setTest("rgba(255, 0, 0, 0.2)");
        } else {
            setTest("transparent");
        }
    };

    return (
        <div className="Video">
            <div className="box__video" ref={videoContainer}>
                <video ref={videoSelector} className="video" src={videoInfo.url || null} onMouseMove={onMouseEnterShow}>
                    <source src={videoInfo.url} type="video/mp4" />
                </video>
                {showControl ? (
                    <div className="box__screen">
                        <div className="screen" onMouseMove={onMouseMoveShow}></div>
                        <div className="box__control" onMouseEnter={onMouseEnterShow} onMouseLeave={onMouseLeaveHide} style={{ background: `${test}` }}>
                            <div className="text__title">{videoInfo.title ? videoInfo && videoInfo.title : null}</div>
                            <div className="time-duration">
                                {currentHours > 0 ? `${currentHours}:` : null}
                                {currentSeconds < 10 ? `${currentMinutes}:0${currentSeconds}` : currentMinutes + ":" + currentSeconds} / {totalHours > 0 ? `${totalHours}:` : null}
                                {totalSeconds < 10 ? `${totalMinutes}:0${totalSeconds}` : totalMinutes + ":" + totalSeconds}
                            </div>
                            <div className="progress-bar">
                                <div className="box__gauge">
                                    <div className="gauge" style={{ width: `${percentNum}%` }}></div>
                                </div>
                                <input ref={inputElem} onChange={(e) => onProgressChange(parseInt(e.target.value, 10))} type="range" min="0" max="100" step="1" value={percentNum} />
                            </div>
                            <div className="control-bar">
                                <div className="box__button">
                                    <button
                                        className="button"
                                        onClick={() => {
                                            onPlayClick();
                                        }}
                                    >
                                        {nowPlaying ? <Pause width="48" height="48" alt="정지하기" /> : <Play width="48" height="48" alt="재생하기" />}
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            onBackwardClick();
                                        }}
                                    >
                                        <Backward width="48" height="48" alt="뒤로 가기" />
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            onForwardClick();
                                        }}
                                    >
                                        <Forward width="48" height="48" alt="앞으로 가기" />
                                    </button>
                                </div>
                                <div className="box__button2">
                                    <button
                                        className="button"
                                        onClick={() => {
                                            onFullClick();
                                        }}
                                    >
                                        {screenFull ? <ScreenSmall width="48" height="48" alt="전체화면 종료" /> : <ScreenFull width="48" height="48" alt="전체화면" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {openSkip ? (
                            <button
                                className="button__skip"
                                onClick={() => {
                                    onSkipClick();
                                }}
                            >
                                오프닝 스킵
                            </button>
                        ) : null}
                    </div>
                ) : null}

                {endSkip ? (
                    <button
                        className="button__skip close"
                        onClick={() => {
                            onEndSkipClick();
                        }}
                    >
                        엔딩 스킵
                    </button>
                ) : null}
            </div>
            <button type="button" className="button2" onClick={changeColor}>
                동영상 컨트롤러 영역 색상표시 On/Off
            </button>
        </div>
    );
}

export default Video;
