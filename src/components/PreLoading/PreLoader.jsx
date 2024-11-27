import React, { useEffect, useRef } from "react";
import "./Preloader.css";

const Preloader = () => {
  const preloaderRef = useRef(null);

  useEffect(() => {
    const preload = preloaderRef.current;
    
    const timer1 = setTimeout(() => {
      preload.style.opacity = "0";
      const timer2 = setTimeout(() => {
        preload.style.display = "none";
      }, 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, 3000);

  }, []);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="spinner_wrap">
        <div className="spinner" />
      </div>
    </div>
  );
};

export default Preloader;
