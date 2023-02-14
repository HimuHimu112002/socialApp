import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProjectGallery from './ProjectGallery';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEdcation from './ProfileEdcation';
import DashBoard from './DashBoard'
import UserList from './UserList';

const ProfileAllContent = () => {

return (
    <div className='tabSection'>

        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
          >
        
          <Tab eventKey="profile" title="Profile">
              <ProfileAbout></ProfileAbout>
              <ProjectGallery></ProjectGallery>
              <ProfileExperience></ProfileExperience>
              <ProfileEdcation></ProfileEdcation>
          </Tab>

          <Tab eventKey="home" title="Friends">
              <UserList></UserList>     
          </Tab>

          <Tab eventKey="contact" title="Post">
              <DashBoard></DashBoard>
          </Tab>

        </Tabs>
    </div>
  )
}

export default ProfileAllContent