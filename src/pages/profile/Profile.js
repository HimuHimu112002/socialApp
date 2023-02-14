import React from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Footer from '../../component/Footer';
import NavMenu from '../../component/NavMenu';
import ProfileAllContent from '../../component/ProfileAllContent';
import ProfileHeading from '../../component/ProfileHeading';


const Profile = () => {
  return (
    <Container>
      <Row className='homeBgColor'>
        <NavMenu></NavMenu>
        <Col >         
        <ProfileHeading></ProfileHeading>
        <ProfileAllContent></ProfileAllContent>      
        </Col>
        <Footer></Footer>
      </Row>
    </Container>
  )
}

export default Profile