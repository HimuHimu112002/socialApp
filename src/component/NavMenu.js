import React, { useState } from 'react'
import { Col, Row,Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector} from 'react-redux';
import { AiFillCaretDown } from 'react-icons/ai';
import { getAuth, signOut } from "firebase/auth";
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import { AiOutlineLogout,AiOutlineSetting } from 'react-icons/ai';

const NavMenu = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let data = useSelector((state)=> state.userLoginInfo.userInfo);

  let [handleLogoutShow, sethandleLogoutShow] = useState(false)


  // logout handle 
let handleLogout = () =>{
  signOut(auth).then(() => {
    dispatch(userLoginInfo(null))
    localStorage.removeItem("userInfo")
    navigate("/login")
    
  })
}

return (
    <Container>
        <Row>
            <Col className='NavBg'>
            <Navbar className='px-4' variant="dark">             
                <Navbar.Brand href="#home"><img className='logo' src='image/linkdin.jpg'/></Navbar.Brand>
                <Nav className="m-auto">
                  <Link to="/"><Nav href="#home">Home</Nav></Link>
                  <Nav href="#"><Link to="/profile">Profile</Link></Nav>
                  <Link to="/contact"><Nav href="#">Contact</Nav></Link>
                </Nav>

                <div className='LogoutSection mt-1'>

                <div className='navUserPicDiv'>
                  <img onClick={()=>sethandleLogoutShow(!handleLogoutShow)} className='logo' src={data && data.photoURL}/>
                </div>
                <AiFillCaretDown onClick={()=>sethandleLogoutShow(!handleLogoutShow)} className='text-white navarrow'></AiFillCaretDown>

                {handleLogoutShow && 
                
                <div className='LogoutSectionDesign'>

                  <div onClick={handleLogout}>                 
                    <Button className='logOUtButtonAccess'>LOG OUT<AiOutlineLogout className='pen_icon'></AiOutlineLogout></Button>      
                  </div>
                  <div className='mt-3'>                 
                    <Button className='logOUtButtonAccess'>SETTING<AiOutlineSetting className='pen_icon'></AiOutlineSetting></Button>      
                  </div>
                </div>
                }
                </div>              
            </Navbar>
            </Col>
        </Row>
    </Container>
  )
}

export default NavMenu