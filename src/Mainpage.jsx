import React, { useState } from "react";
import { motion } from "framer-motion";

const Mainpage = () => {
  const items = [
    { id: 1, color: "red" },
    { id: 2, color: "blue" },
    { id: 3, color: "green" },
    { id: 4, color: "yellow" },
    { id: 5, color: "orange" },
    { id: 6, color: "purple" },
    { id: 7, color: "pink" },
    { id: 8, color: "teal" },
    { id: 9, color: "cyan" },
    { id: 10, color: "lime" },
  ];

  const [selectedId, setSelectedId] = useState(1); // Mặc định chọn ô đầu tiên
  const [fakeItemPosition, setFakeItemPosition] = useState(null); // Lưu vị trí click

  const handleClick = (e, id) => {
    const { clientX, clientY } = e; // Lấy tọa độ (x, y) của sự kiện click

    setSelectedId(id);
    setFakeItemPosition({ x: clientX, y: clientY }); // Lưu vị trí click
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Vùng item con giả */}
      {fakeItemPosition && (
        <motion.div
          className="absolute w-16 h-16 rounded-lg"
          style={{
            backgroundColor: items.find((item) => item.id === selectedId)
              ?.color,
            left: fakeItemPosition.x - 32, // Đặt vị trí click vào để căn giữa item giả
            top: fakeItemPosition.y - 32,
          }}
          key={`fake-item-${selectedId}`} // Thêm key mới khi selectedId thay đổi
          initial={{ opacity: 1 }}
          animate={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}

      {/* Vùng danh sách các ô nhỏ */}
      <div className="flex space-x-4 mt-auto mb-5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`w-16 h-16 cursor-pointer transform transition-transform duration-300 hover:scale-110`}
            style={{
              backgroundColor: item.color,
              opacity: item.id === selectedId ? 0.6 : 1,
              zIndex: item.id === selectedId ? 10 : 1,
            }}
            onClick={(e) => handleClick(e, item.id)} // Truyền sự kiện click để lấy vị trí
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Mainpage;
