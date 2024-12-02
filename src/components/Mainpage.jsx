import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import playIcon from "../assets/icons8-play-100.png";
import pauseIcon from "../assets/icons8-pause-100.png";
import BackgroundBubbles from "./BackgroundBubbles/BackgroundBubbles";
const Mainpage = ({ items }) => {
  const [selectedId, setSelectedId] = useState(1);
  const [fakeItemPosition, setFakeItemPosition] = useState({
    x: null,
    y: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const vidRef = useRef();

  useEffect(() => {
    if (items && items.length > 0) {
      const firstItem = items[0]; // Item đầu tiên trong danh sách
      setFakeItemPosition({
        x: window.innerWidth / 2, // Vị trí căn giữa màn hình
        y: window.innerHeight / 3, // Vị trí căn giữa một chút từ trên xuống
      });
      setSelectedId(firstItem.id); // Mặc định chọn item đầu tiên
    }
  }, [items]);

  const handleClick = (e, id) => {
    const { clientX, clientY } = e; // Lấy tọa độ (x, y) của sự kiện click
    setSelectedId(id);
    setFakeItemPosition({ x: clientX, y: clientY }); // Lưu vị trí click

    setIsPlaying(false); // Dừng video khi chuyển đổi
    setIsButtonVisible(true); // Hiển thị nút khi chuyển đổi video
    setIsButtonHovered(false); // Đặt trạng thái hover nút về mặc định
  };

  const handlePlayPause = () => {
    const video = vidRef.current;
    if (isPlaying) {
      video.pause(); // Dừng video
    } else {
      video.play(); // Phát video
      setIsButtonVisible(false); // Ẩn nút khi video bắt đầu phát
    }
    setIsPlaying(!isPlaying); // Cập nhật trạng thái phát video
  };

  const handleMouseEnter = () => {
    setIsButtonHovered(true); // Khi hover vào nút, giữ nút hiển thị
  };

  const handleMouseLeave = () => {
    setIsButtonHovered(false); // Khi rời chuột khỏi nút, kiểm tra nếu không hover vào video thì ẩn nút
    if (!isPlaying) {
      setIsButtonVisible(false); // Ẩn nút nếu video không chơi và không hover vào nút
    }
  };

  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true); // Khi hover vào nút, giữ nút hiển thị
  };

  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false); // Khi rời chuột khỏi nút, kiểm tra nếu không hover vào video thì ẩn nút
    if (!isPlaying) {
      setIsButtonVisible(false); // Giữ nút ẩn khi video không phát
    }
  };

  const renderMedia = (item, isFakeItem = false) => {
    if (item.isVideo) {
      return (
        <video
          ref={vidRef}
          src={item.img}
          alt={`Item ${item.id}`}
          className={`${
            isFakeItem
              ? "xl:h-[65%] xl:w-auto w-[95%] xl:border-2 border-[#1e2721]"
              : "w-full h-full"
          } rounded-xl shadow-[0_20px_80px_rgba(228,_224,_225,_0.3)]`}
          disablePictureInPicture
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    } else {
      return (
        <img
          src={item.img}
          alt={`Item ${item.id}`}
          className={`${
            isFakeItem
              ? "xl:h-[65%] xl:border-2  border-[#1e2721]"
              : "w-full h-full"
          } rounded-xl shadow-[0_10px_50px_rgba(228,_224,_225,_0.9)]`}
        />
      );
    }
  };

  const handleNext = () => {
    if (selectedId < items.length) {
      setSelectedId((prevId) => prevId + 1);
    }
  };

  const handleBack = () => {
    if (selectedId > 1) {
      setSelectedId((prevId) => prevId - 1);
    }
  };

  return (
    <div className="backgroundCustom relative flex flex-col items-center justify-center min-h-screen min-w-full overflow-hidden">
      {/* Custom background */}
      <BackgroundBubbles />
      {/* Fake item */}
      <div className="w-full h-full">
        {fakeItemPosition.x !== null && fakeItemPosition.y !== null && (
          <motion.div
            className="absolute rounded-2xl overflow-hidden w-full flex justify-center items-center"
            style={{
              left: fakeItemPosition.x - 32,
              top: fakeItemPosition.y - 32,
            }}
            key={`fake-item-${selectedId}`}
            initial={{ opacity: 0.2, width: 64, height: 64 }}
            animate={{
              left: "50%",
              top: "40%",
              x: "-50%",
              y: "-50%",
              width: "100%",
              height: "100vh",
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              duration: 1,
            }}
          >
            <button
              className={`absolute text-white bg-black p-3 rounded-full z-20 transition-opacity duration-500 ${
                isButtonVisible || isButtonHovered ? "opacity-50" : "opacity-0"
              }`}
              onClick={handlePlayPause}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              <img width={36} src={isPlaying ? pauseIcon : playIcon} />
            </button>

            {renderMedia(
              items.find((item) => item.id === selectedId),
              true
            )}
          </motion.div>
        )}
        {/* Nút next và back */}
        <div className="absolute xl:bottom-9 bottom-[13rem] flex justify-between w-full px-16">
          <button
            className="bg-black text-white p-3 rounded-full opacity-70 hover:opacity-100 cursor-pointer"
            onClick={handleBack}
            disabled={selectedId === 1}
          >
            Back
          </button>
          <button
            className="bg-black text-white p-3 rounded-full opacity-70 hover:opacity-100 cursor-pointer"
            onClick={handleNext}
            disabled={selectedId === items.length}
          >
            Next
          </button>
        </div>
      </div>

      {/* Vùng danh sách các ô nhỏ */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-10 xl:gap-4 gap-2 mt-auto xl:mb-5 mb-28 bg-gray-100 xl:p-4 p-1 xl:rounded-xl shadow-lg xl:w-3/4 sm:w-full">
        {items?.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer transform transition-transform duration-500 hover:scale-110 overflow-hidden rounded-xl`}
            style={{
              opacity: item.id === selectedId ? 0.6 : 1,
              zIndex: item.id === selectedId ? 10 : 1,
            }}
            onClick={(e) => handleClick(e, item.id)}
          >
            <div className="w-full h-full overflow-hidden">
              {renderMedia(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mainpage;
