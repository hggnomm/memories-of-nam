import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const Loading = ({ isLoading, error, children }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 9998,
          }}
        />
      )}

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
          }}
        >
          <ClipLoader size={40} color={"#A64D79"} loading={isLoading} />
        </div>
      )}

      <div style={{ filter: isLoading ? "blur(5px)" : "none" }}>{children}</div>
    </div>
  );
};

export default Loading;
