import React, { useState } from "react";
import { motion } from "framer-motion";

const Mainpage = () => {
  const items = [
    {
      id: 1,
      img: "https://i.pinimg.com/736x/8a/43/13/8a4313e79bfcd035f8afb11f45a0da14.jpg",
    },
    {
      id: 2,
      img: "https://i.pinimg.com/736x/1b/1b/67/1b1b6719dccc56795ea66373643b65b7.jpg",
    },
    {
      id: 3,
      img: "https://i.pinimg.com/736x/eb/72/1a/eb721affa31054f33b9e1773d3d40656.jpg",
    },
    {
      id: 4,
      img: "https://i.pinimg.com/736x/1a/bd/d1/1abdd1f13b8f7c628dd85b54bda9abc8.jpg",
    },
    {
      id: 5,
      img: "https://i.pinimg.com/736x/bd/7e/39/bd7e39b5dbb1f0d18d05641c26023937.jpg",
    },
    {
      id: 6,
      img: "https://i.pinimg.com/736x/0c/62/57/0c6257c0642a34c082b581850c0ec8c0.jpg",
    },
    {
      id: 7,
      img: "https://i.pinimg.com/736x/18/e6/82/18e682343918693884d7b3bd1324242c.jpg",
    },
    {
      id: 8,
      img: "https://i.pinimg.com/736x/7f/5e/b6/7f5eb6e9e2b5c84a11fe3043ae224a67.jpg",
    },
    {
      id: 9,
      img: "https://i.pinimg.com/736x/50/e9/77/50e9773f611647834e465f9032f686e2.jpg",
    },
    {
      id: 10,
      img: "https://i.pinimg.com/736x/09/fd/60/09fd601589cf76ade35dd879e791a74e.jpg",
    },
  ];

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
      {fakeItemPosition.x && (
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
        {items.map((item) => (
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
