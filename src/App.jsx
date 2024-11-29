import React from "react";
import FileList from "./components/Filelist";
import { ToastContainer } from "react-toastify";
import Preloader from "./components/PreLoading/PreLoader";
import CommingSoon from "./components/ComingSoon/ComingSoon";

const App = () => {
  return (
    <div className="h-screen w-screen bg-red-50">
      <ToastContainer />
      <FileList />
      {/* <CommingSoon /> */}
      <Preloader />
    </div>
  );
};

export default App;
