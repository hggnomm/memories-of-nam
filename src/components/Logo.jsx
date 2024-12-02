import React from "react";
import logoNom from "../assets/logo-nam.png";

const Logo = () => {
  return (
    <div className="fixed xl:top-10 xl:left-11 top-5 left-5 z-20 w-screen">
      <img src={logoNom} alt="" className="w-32 mb-6" />
      <div className="flex xl:block justify-between items-center mr-10">
        <div>
          <span className="text-white ml-1 mb-1 block">
            Began: 1-12-2024
          </span>
          <span className="text-white ml-1 mb-1 block">Camera: Y4000</span>
        </div>

        <div>
          <span className="text-gray-300 ml-1 xl:mt-8 block w-44 italic text-sm xl:text-base">
            Mọi khoảnh khắc và sự hoài niệm, nó chính là yếu tố tạo nên giá trị cho cuộc
            sống.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
