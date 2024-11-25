import React from "react";
import FileList from "./Filelist";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="container">
      <ToastContainer />
      <FileList />
    </div>
  );
};

export default App;
