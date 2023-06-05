import React,{useEffect,useState} from 'react'
import { useSelector} from 'react-redux';
import {Container, Row, Button,Form,Modal, Col} from 'react-bootstrap';
import { getDatabase, ref, onValue,set, push} from "firebase/database"
import { Link} from 'react-router-dom';
import "cropperjs/dist/cropper.css";
import { getStorage, ref as sref , uploadString,getDownloadURL, uploadBytesResumable,uploadBytes } from "firebase/storage";


const ProfileHeading = () => {
  // for user information access
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  
  const db = getDatabase();
  const storage = getStorage();

  let [showPostBio, setshowPostBio] = useState([])
  let [showContact, setshowContact] = useState([])
  let [modepostshow, setmodepostshow] = useState(false)
  let [CoverPhotoModal, setCoverPhotoModal] = useState(false)
  let [CoverImg, setCoverImg] = useState("")
  let [showCoverPhoto, setshowCoverPhoto] = useState([])

useEffect(()=>{
  onValue(ref(db, 'postBio'), (snapshot) => {
    let arr = []
    snapshot.forEach((item)=>{
      if(item.val().whopost == data.uid){
        arr.push({...item.val(), id:item.key})
      }
    });
    setshowPostBio(arr);
    });
}, [])

useEffect(()=>{
  onValue(ref(db, 'contact'), (snapshot) => {
    let arr = []
    snapshot.forEach((item)=>{
      
      if(item.val().whopost == data.uid){
        arr.push({...item.val(), id:item.key})
      }
    });
    setshowContact(arr);
    });
}, [])

 let handleContactInfo = ()=>{
  setmodepostshow(true)
 }
 let modeContactcansel = ()=>{
  setmodepostshow(false)
 }
 let handleContactInfoClose = ()=>{
  setmodepostshow(false)
 }


 // cover photo upload 

 let handleCoverModalCancel = ()=>{
  setCoverPhotoModal(false)
 }

 let handleCoverphotoUpload = (e) => {
  const storageRef = sref(storage, 'some-child');
  uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
    getDownloadURL(storageRef).then((downloadURL) => {
      setCoverImg(downloadURL)
    });
  });
}

let coverImgSubmit = (e) => {
  set(ref(db, 'coverpic/' + data.uid), {
    coverimg: CoverImg,
    userid: data.uid,
  }).then(() => {
    setCoverPhotoModal(false)
    handleCoverphotoUpload('')
  })
}

useEffect(()=>{
  const starCoverRef = ref(db, 'coverpic/');
  onValue(starCoverRef, (snapshot)=>{
    let arr = []
    snapshot.forEach((item)=>{
      if(data.uid == item.key){
        arr.push(item.val())
      }
    });
    setshowCoverPhoto(arr)
  });
},[])


return (
  <Container>
    <Row>
      <Col>
        <div className='profile mb-4'>

          
          <div className='cover_img'>
            {showCoverPhoto.length == 0 
            ?
            <img src='image/tree.jpg'></img> 

            :
            showCoverPhoto.map((item)=>(
              <img src={item.coverimg}></img>
            ))
            }

            <div onClick={()=>setCoverPhotoModal(!CoverPhotoModal)} className='cover_text'>
              <span className='text-white'>Edit Cover Photo</span>
            </div>
                       
          </div>

          <div className='PorfilePage_profile_img'>

            <div className='PostprofilePic'>
              <img src={data.photoURL}></img>
            </div>

            <div className='postPageBio'>
              <div className='PostPage_profile_name'>
                <h5 className='mt-2 text-white'>{data.displayName}</h5>
              </div>             

              {showPostBio.map((item)=>(
                <p className='text-white'>{item.post}</p>
              ))}

              <div>  
                <div>
                  <Button onClick={handleContactInfo} className='ProfilePageButton' variant="success">CONTACT INFO</Button>
                </div>               

                  <Link to="/contact">
                    <div className='AddContactButton mt-3'> 
                      <Button>ADD CONTACT</Button>
                    </div>
                  </Link>
              </div>

            </div>
          </div>
        </div>

      </Col>
    </Row>
    
    {/* post title modal  start ======================================= */}
    <Modal className='modalBody' show={modepostshow} onHide={handleContactInfoClose}>
            <Modal.Header closeButton>
              <Modal.Title>User contact information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                {showContact.map((item)=>(
                  <>
                    <h5>Name : {data.displayName}</h5>
                    <p>Email : {item.email}</p>
                    <p>Phone : {item.phone}</p>
                    <p>Discription : {item.comment}</p>
                  </>
                ))}
            </Form>
            </Modal.Body>
            <Modal.Footer className='text-center d-flex justify-content-center mb-2'>
              <Button className='bg-danger' variant="secondary" onClick={modeContactcansel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>


        {/* Cover modal secton */}

        {CoverPhotoModal && 
        
        <Col className='profile_img_upload'  md="6">
          <div className='profile_main_section'>
            <div>
              <h1 className='text-center profile_modal_text'>Update Your Cover Photo.</h1>
              
              <div className='Choose__img'>
                <input onChange={handleCoverphotoUpload} type="file"></input>
              </div>
              
              <div className='profile_modal--button'>

                <Button onClick={coverImgSubmit} variant="success">Update Cover</Button>               
                <Button onClick={handleCoverModalCancel} variant="danger">Cancel</Button>

              </div>
            </div>
          </div>
        </Col>
        }

  </Container>
)
}
export default ProfileHeading