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
import EditProjectPage from './pages/private/user/EditProjectPage/EditProjectPage';
import ProfileEditPage from './pages/private/user/ProfileEditPage/ProfileEditPage';
import Unauthorized from './pages/public/Unauthorized/Unauthorized';
import ExplorePage from './pages/private/user/ExplorePage/ExplorePage';
import TopProjects from './pages/private/user/TopProjects/TopProjects';

const App = () => {
  return (
    <div className="App">
      <ToastContainer />
      <Router>

        <Routes>
          <Route path="" element={<Home />} />

          <Route path="/login" element={<><Header /><AuthComponent /></>} />
          <Route path="/mypage" element={<><Header /><UserPage /></>} />
          <Route path="/projectPage/:id" element={<><Header /><ProjectPage /></>} />
          <Route path="/addProject/:userId" element={<><Header /><AddProject /></>} />
          <Route exact path="/editProject/:id" element={<IDE />} ></Route>
          <Route exact path="/editProjectPage/:id" element={<><Header /><EditProjectPage /></>} ></Route>
          <Route exact path="/user/profile/edit/" element={<><Header /><ProfileEditPage /></>} ></Route>
          <Route exact path="/unauthorized" element={<><Header /><Unauthorized /></>} ></Route>
          <Route path="/explore" element={<><Header /><ExplorePage /></>} />
          <Route path="/top-projects" element={<><Header /><TopProjects /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
