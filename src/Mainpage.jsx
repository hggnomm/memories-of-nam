import React, { useState } from "react";
import { motion } from "framer-motion";

const Mainpage = ({ items }) => { // Nhận data items từ props
  console.log(items)
  const [selectedId, setSelectedId] = useState(1); // Mặc định chọn ô đầu tiên
  const [fakeItemPosition, setFakeItemPosition] = useState({
    x: null,
    y: null,
  });

  const handleClick = (e, id) => {
    const { clientX, clientY } = e; // Lấy tọa độ (x, y) của sự kiện click
    setSelectedId(id);
    setFakeItemPosition({ x: clientX, y: clientY }); // Lưu vị trí click
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Vùng item con giả */}
      {fakeItemPosition.x !== null && fakeItemPosition.y !== null && (
        <motion.div
          className="absolute rounded-lg overflow-hidden"
          style={{
            left: fakeItemPosition.x - 32, // Đặt vị trí click để căn giữa item giả
            top: fakeItemPosition.y - 32,
          }}
          key={`fake-item-${selectedId}`} // Thêm key mới khi selectedId thay đổi
          initial={{ opacity: 1, width: 64, height: 64 }}
          animate={{
            left: "50%",
            top: "30%",
            x: "-50%",
            y: "-50%",
            opacity: 1,
            width: 256,
            height: 256,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <img
            src={items.find((item) => item.id === selectedId)?.img}
            alt={`Selected item ${selectedId}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Vùng danh sách các ô nhỏ */}
      <div className="flex space-x-4 mt-auto mb-5">
        {items?.map((item) => (
          <div
            key={item.id}
            className={`w-16 h-16 cursor-pointer transform transition-transform duration-500 hover:scale-110 overflow-hidden rounded-lg`}
            style={{
              opacity: item.id === selectedId ? 0.6 : 1,
              zIndex: item.id === selectedId ? 10 : 1,
            }}
            onClick={(e) => handleClick(e, item.id)} // Truyền sự kiện click để lấy vị trí
          >
            <img
              src={item.img}
              alt={`Item ${item.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mainpage;
