import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Registrations from './pages/ragistrations/Registrations';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import ForgotPass from './pages/forgotPassword/ForgotPass';
import firebaseConfig from './firebaseConfig'
import { Provider } from 'react-redux'
import store from './store';
import PostPage from './component/PostPage';
import Profile from './pages/profile/Profile';
import Contact from './component/Contact';
import UserExperience from './component/UserExperience'
import UserEducation from './component/UserEducation';
import ProjectGallery from './component/ProjectGallery';
import DashBoard from './component/DashBoard';
import Setting from './pages/setting/Setting';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>
    
  },
  {
    path: "/ragistrations",
    element: <Registrations></Registrations>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPass></ForgotPass>,
  },
  {
    path: "/postPage",
    element: <PostPage></PostPage>,
  },
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  {
    path: "/contact",
    element: <Contact></Contact>,
  },
  {
    path: "/experience",
    element: <UserExperience></UserExperience>,
  },
  {
    path: "/education",
    element: <UserEducation></UserEducation>,
  },
  {
    path: "/gallery",
    element: <ProjectGallery></ProjectGallery>,
  },
  {
    path: "/dashboard",
    element: <DashBoard></DashBoard>
  },
  {
    path: "/setting",
    element: <Setting></Setting>
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store} >
        <RouterProvider router={router} />
    </Provider>
);

