import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const LoadingSpinner = ({ isLoading, error, successMessage, children }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (successMessage) {
      toast.success(successMessage);
    }
  }, [error, successMessage]);

  return (
    <div>
      {/* Full screen loading spinner */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#A64D79",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <ClipLoader size={50} color={"#fff"} loading={isLoading} />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default LoadingSpinner;
