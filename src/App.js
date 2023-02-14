import Contact from './component/Contact'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from 'react-redux'
import RootlayOut from './component/RootlayOut'
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import store from './store';
import PostPage from './component/PostPage'
import Login from './pages/login/Login'
import Registrations from './pages/ragistrations/Registrations'

function App() {
  // <Registrations></Registrations>
  // let router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route path="/" element={<RootlayOut></RootlayOut>}>
  //       <Route index element={<Home></Home>}></Route>
  //       <Route path="/profile" element={<Profile></Profile>}></Route>
  //       <Route path="/contact" element={<Contact></Contact>}></Route>
  //       <Route path="/postpage" element={<PostPage></PostPage>}></Route>
  //       <Route path="/login" element={<Login></Login>}></Route>
  //       <Route path="/ragistrations" element={<Registrations></Registrations>}></Route>
  //     </Route>
  //   )
  // )
  return (
    <>

      {/* <Provider store={store} >
        <RouterProvider router={router} />
      </Provider> */}

    </>
  );
}

export default App;
