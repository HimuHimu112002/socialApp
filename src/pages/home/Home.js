import React, { useState, useEffect } from 'react'
import {Container,Row, Col} from 'react-bootstrap';
import HomeProfile from '../../component/HomeProfile';
import HomePostSection from '../../component/HomePostSection';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import NavMenu from '../../component/NavMenu'
import Footer from '../../component/Footer'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from '../../slices/userSlice';

const Home = () => {  

  let navigate = useNavigate();
  const auth = getAuth();
  let dispatch = useDispatch()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  
  useEffect(()=> {
    if(!data){
      navigate("/login")
    }
  },[])

return (

  <>

  <Container>
    <Row className='homeBgColor'>
      
        <NavMenu></NavMenu>
          <Col md="7">
            <HomePostSection></HomePostSection>
          </Col>
          <Col md="5">
            <HomeProfile></HomeProfile>
          </Col>
        <Footer></Footer>
    </Row>   
  </Container>
  
  </>
  )
}

export default Home