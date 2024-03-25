import React from 'react';
import "./App.css";
import Header from './containers/Header/Header';
import IDE from './pages/private/user/IDE/IDE';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/public/Home/Home";
import AuthComponent from "./pages/public/Auth/AuthComponent";
import UserPage from "./pages/private/user/UserPage/UserPage";
import AddProject from "./pages/private/user/AddProject/AddProject";
import ProjectPage from "./pages/private/user/ProjectPage/ProjectPage";
import { ToastContainer } from 'react-toastify'; // Adaugă această linie
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="App">
      <ToastContainer /> {/* Notificări */}
      <Router>
        <Header />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<AuthComponent />} />
          <Route path="/mypage" element={<UserPage />} />
          <Route path="/projectPage/:id" element={<ProjectPage />} />
          <Route path="/addProject/:userId" element={<AddProject />} />
          <Route exact path="/editProject/:id" element={<IDE />} ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
