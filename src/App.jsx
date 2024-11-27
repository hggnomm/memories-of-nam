import React from "react";
import FileList from "./components/Filelist";
import { ToastContainer } from "react-toastify";
import Preloader from "./components/PreLoading/PreLoader";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <FileList />
      <Preloader />
    </div>
  );
};

export default App;
