import React,{useEffect,useState} from 'react'
import { useSelector} from 'react-redux';
import {Container, Row, Col, Form, Button, Modal} from 'react-bootstrap';
import { BiPencil } from 'react-icons/bi';
import { getDatabase, ref, set, push, onValue, update } from "firebase/database"
import { getAuth,updateProfile } from "firebase/auth";
import { BsUpload } from 'react-icons/bs';
import {useNavigate } from 'react-router-dom';
import { getStorage, ref as sref, uploadString,getDownloadURL,ref as storageref,  } from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { userLoginInfo } from '../slices/userSlice';
import { RotatingLines } from 'react-loader-spinner'


const HomeProfile = () => {
  // for user information access
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  
  // for profile photo access
  const auth = getAuth();
  const storage = getStorage();

  const db = getDatabase();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  let [profileDiscriptions, setprofileDiscriptions] = useState(false)
  let [showPostBio, setshowPostBio] = useState([])
  let [postBio, setBio] = useState("")
  let [postBioerror, setBioerror] = useState("")
  let [Id, setid] = useState(false)
  let [modelShow, setmodelShow] = useState(false)
  let [showCoverPhoto, setshowCoverPhoto] = useState([])

  // profile img upload
  const [profileImageUploadShow, setprofileImageUploadShow] = useState(false);
  let [loading, setloading] = useState(false)

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  let handleProfileImageUpload =()=>{
    setprofileImageUploadShow(true)
    setloading(false)
  }
  let handleImageUploadCancel = ()=>{
    setprofileImageUploadShow(false)
    setImage("")
    setCropper("")
    setCropData("")

  }

  const handleProfileUpload = (e) => {
    //e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setloading(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storageRef = sref(storage, 'profile/' + auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log(downloadURL)
          updateProfile(auth.currentUser, { 
            photoURL: downloadURL,

          }).then(()=>{
            setloading(false)
            setTimeout(()=>{
              toast.success("Profile Picture Upload Successfull.")
            },1000)

            setTimeout(()=>{
              setprofileImageUploadShow(false) 
            },3000)
            setImage("")
          });
        });
      });
    }
  };


/* profile postBio start ===================*/

let handleProfileDescriptionInput = (e) =>{
  setBio(e.target.value)
  setBioerror("")
}

let handleProfileDescriptionSubmit =()=>{

  setTimeout(()=>{
    profileDiscriptions(false)
  },2000)
  if(!postBio){
    setBioerror("Write Here !")
  }
  if(postBio){
    set(push(ref(db, 'postBio')),{
      post:postBio,
      whopost:data.uid,
     }).then(()=>{
      handleProfileDescriptionInput("")
     })
  }

}

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


/* profile postBio updating ===================*/
let handleUpdateBio = (id)=>{
  setid(id)
  setmodelShow(true)
}

let handleClose = ()=>{
  setmodelShow(false)
  update(ref(db, 'postBio/' + Id), {
    post:postBio,
  })
}

let modelcansel =()=>{
  setmodelShow(false)
}



/* profile postBio end ===================*/

 // cover image show

 useEffect(()=>{
  const starCoverRef = ref(db, 'coverpic');
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
  <ToastContainer position="top-right" theme="dark"/>
    <Row>
      <Col>
        <div className='profile'>

          <div className='cover_img'>
            {showCoverPhoto.length == 0 
            ?
            <img src='image/tree.jpg'></img> 

            :
            <div>
              {showCoverPhoto.map((item)=>(
                <img src={item.coverimg}></img>
              ))}

            </div>
            }                                                       
          </div>

          <div className='profile_img'>

            <div onClick={handleProfileImageUpload} className='profilePic'>
              <img src={data && data.photoURL}/>
              <div className='profileOverly'><BsUpload></BsUpload></div>
            </div>
            

            <div>

              <div className='profile_name'>
               <h5 className='mt-2 text-white'>Name: {data && data.displayName}</h5>
              </div>


              <div className='homeProfileButto mt-3'>
                <div onClick={()=>setprofileDiscriptions(!profileDiscriptions)}>                  
                  <Button className='postDeleteButton'>EDIT BIO</Button>                 
                </div>                
              </div>
              

              {profileDiscriptions &&
                <>
                  <div className='post_input-section d-flex'>
                    {showPostBio.length == 0 &&
                      <>

                        <Form.Control className='mt-2' onChange={handleProfileDescriptionInput} size="lg" type="text" placeholder="Write Your's Some Experiance" />
                        <Button onClick={handleProfileDescriptionSubmit} className='post_input-button' variant="primary">Save</Button>

                      </>
                    }
                  </div>
                  <p className='text-danger'>{postBioerror}</p>
                </>
              }

              {showPostBio.map((item)=>(
                              
                <p className='profile_subheading mt-3 text-white'>{item.post}<BiPencil onClick={()=>handleUpdateBio(item.id)}></BiPencil></p>

              ))}

            </div>
          </div>
      </div>

      {/* Bio updating modal  start ======================   */}
      
      <Modal show={modelShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Write Updating discriptions</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasictext">
            <Form.Label>Updating Bio.</Form.Label>
            <Form.Control className='job_discriptions_border' onChange={handleProfileDescriptionInput} type="text"/>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-center mb-2'>       
          <Button variant="success" onClick={handleClose}>
            Update
          </Button>

          <Button className='bg-danger' variant="secondary" onClick={modelcansel}>
            Cancel
          </Button>
        </Modal.Footer>

      </Modal>
      {/* Bio updating modal  end ==================================== */}

      </Col> 
    </Row>
    <Row>
    
      {profileImageUploadShow &&      
        <Col className='profile_img_upload'  md="6">
        <div className='profile_main_section'>
          <div >
            <h1 className='text-center profile_modal_text'>Update Your Profile picture.</h1>
            {image ? 
              (<div className='profile_img_main_section'>
                <div className='profileUpload_img img-preview'>
                  <img src={data && data.photoURL}></img>
                </div>                     
              </div>
              ) 
              : 
              (<div className='profile_img_main_section'>
                <div className='profileUpload_img'>
                <img src={data && data.photoURL}></img>
                
                </div>                     
              </div> )                              
                              
            }

            <div className='Choose__img'>
              <input onChange={handleProfileUpload} type="file"></input>
            </div>
            
            {image && 
            
                <Cropper
                style={{ height: 200, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            }

            <div className='profile_modal--button'>
                  {loading ?
                    <div className='text-center'>
                    <RotatingLines
                      strokeColor="white"
                      strokeWidth="3"
                      animationDuration="0.75"
                      width="50"
                      visible={true}
                    />
                    </div>
                    
                    :
                    <Button onClick={getCropData} variant="success">upload profile</Button>
                                     
                  }
                  <Button onClick={handleImageUploadCancel} variant="danger">Cancel</Button>
            </div>
          </div>
        </div>
      </Col>
      }
    </Row>
  </Container>
)
}
export default HomeProfile