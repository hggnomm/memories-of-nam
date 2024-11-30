import React from "react";
import FileList from "./components/Filelist";
import { ToastContainer } from "react-toastify";
import Preloader from "./components/PreLoading/PreLoader";
import CommingSoon from "./components/ComingSoon/ComingSoon";
import Logo from "./components/Logo";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <ToastContainer />
      <Logo />
      <FileList />
      {/* <CommingSoon /> */}
      <Preloader />
    </div>
  );
};

export default App;
