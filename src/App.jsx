import React from "react";
import FileList from "./Filelist";
import { ToastContainer } from "react-toastify";
import Mainpage from "./MainPage";

const App = () => {
  return (
    <div className="container">
      {/* <ToastContainer />
      <FileList /> */}
      <Mainpage />
    </div>
  );
};

export default App;
