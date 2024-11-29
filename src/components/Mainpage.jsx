import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Mainpage = ({ items }) => {
  const [selectedId, setSelectedId] = useState(1);
  const [fakeItemPosition, setFakeItemPosition] = useState({
    x: null,
    y: null,
  });

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
  };

  const renderMedia = (item, isFakeItem = false) => {
    if (item.isVideo) {
      return (
        <video
          src={item.img}
          alt={`Item ${item.id}`}
          className={`${isFakeItem ? "h-3/5" : "w-full h-full"} rounded-xl`}
          controls={isFakeItem}
          disablePictureInPicture
        />
      );
    } else {
      return (
        <img
          src={item.img}
          alt={`Item ${item.id}`}
          className={`${isFakeItem ? "h-3/5" : "w-full h-full"} rounded-xl`}
        />
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen min-w-full bg-[#D9D9D9] overflow-hidden">
      {/* Fake item */}
      <div className="">
        {fakeItemPosition.x !== null && fakeItemPosition.y !== null && (
          <motion.div
            className="absolute rounded-2xl overflow-hidden w-full flex justify-center items-center"
            style={{
              left: fakeItemPosition.x - 32,
              top: fakeItemPosition.y - 32,
            }}
            key={`fake-item-${selectedId}`} // Thêm key mới khi selectedId thay đổi
            initial={{ opacity: 0.2, width: 64, height: 64 }}
            animate={{
              left: "50%",
              top: "45%",
              x: "-50%",
              y: "-50%",
              width: "100%",
              height: "100%",
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 25,
              duration: 1,
            }}
          >
            {renderMedia(
              items.find((item) => item.id === selectedId),
              true
            )}
          </motion.div>
        )}
      </div>

      {/* Vùng danh sách các ô nhỏ */}
      <div className="flex space-x-4 mt-auto mb-5">
        {items?.map((item) => (
          <div
            key={item.id}
            className={`w-32 cursor-pointer transform transition-transform duration-500 hover:scale-110 overflow-hidden rounded-xl`}
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
