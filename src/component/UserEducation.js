import React, { useState } from 'react'
import {Container,Row, Col,Form, Button} from 'react-bootstrap';
import { useSelector} from 'react-redux';
import { getDatabase, ref, set, push } from "firebase/database"
import { Link,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner'
import {getStorage,ref as storageref, uploadBytesResumable, uploadString,getDownloadURL,uploadBytes } from "firebase/storage";
import { RxCross2 } from 'react-icons/rx';

const UserEducation = () => {
  const db = getDatabase();
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  let navigate = useNavigate();
  const storage = getStorage();
  
  let [skill, setskil] = useState("")
  let [experience, setexperience] = useState("")
  let [position, setposition] = useState("")
  let [textarea, settextarea] = useState("")

  let [skillerror, setskillerror] = useState("")
  let [experienceerror, setexperienceerror] = useState("")
  let [positionerror, setpositionerror] = useState("")
  let [textareaerror, settextareaerror] = useState("")
  let [loading, setloading] = useState(false)
  let [PostImg, setPostImg] = useState([])


   // img upload 

   let handleImageUpload = (e)=>{
    const storageRef = storageref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
    (error) => {
      console.log(error)
    },() => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setPostImg(downloadURL)
    
    });
  }
);
}

  let handleSilllName = (e)=>{
    setskil(e.target.value)
    setskillerror("")
  }
  let handleExperienceYear = (e)=>{
    setexperience(e.target.value)
    setexperienceerror("")
  }
  let handleposition = (e)=>{
    setposition(e.target.value)
    setpositionerror("")
  }
  let handleContactTextArea = (e)=>{
    settextarea(e.target.value)
    settextareaerror("")
  }
  let handleSubmit = ()=>{
    if(!skill){
        setskillerror("Skill is required")
    }
    if(!experience){
        setexperienceerror("experience is required")
    }
    if(!position){
        setpositionerror("Positon is required")
    }
    if(!textarea){
      settextareaerror("Discription is required")
    }
    if(skill && experience && position && textarea){
      setloading(true)
      toast.success("Add Successfull.");
      set(push(ref(db, 'education')),{
        experience:experience,
        Skill:skill,
        position:position,
        comment:textarea,
        whopost:data.uid,
        image:PostImg,
       }).then(()=>{
          setTimeout(()=>{
            setloading(false)
            navigate("/profile")
          },3000)
       })
    }
  }
  
  let handlCross = ()=>{
    navigate("/profile")
  }
return (
    <div className='BodyBg'>
      <Container>
      <ToastContainer position="top-right" theme="dark"/>
        <Row className='contactInfo'>
          <Col className='m-auto shadow experienseBG p-4' md="6">
          <span><RxCross2 onClick={handlCross} className='cross_icon'></RxCross2></span>
            <h1 className='text-center mb-4 text-white'>Add Education</h1>
            <Form>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>University Name</Form.Label>
                <Form.Control onChange={handleSilllName} type="text" placeholder="University Name" />
              </Form.Group>
              <p className='text-danger'>{skillerror}</p>

              <p className='text-white'>Select Image Here.</p>
              <input className='mb-2' onChange={handleImageUpload} type='file'></input>


              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Collage Name</Form.Label>
                <Form.Control onChange={handleposition} type="text" placeholder="Work Position Name" />
              </Form.Group>
              <p className='text-danger'>{positionerror}</p>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Passing Year</Form.Label>
                <Form.Control onChange={handleExperienceYear} type="text" placeholder="experience of work" />
              </Form.Group>
              <p className='text-danger'>{experienceerror}</p>

              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label className='text-white'>Education discriptions</Form.Label>
                <Form.Control onChange={handleContactTextArea} as="textarea" rows={3} />
              </Form.Group>
              <p className='text-danger'>{textareaerror}</p>

              

            </Form>

            <div className='postButtonAlign'>
                  {loading ?
                    <div className='postLoading'>
                    <RotatingLines
                      strokeColor="white"
                      strokeWidth="3"
                      animationDuration="0.75"
                      width="50"
                      visible={true}
                      />
                    </div>
                    
                    :
                    <Button onClick={handleSubmit} className='contactButton w-100 mt-3' variant="success">Add Education</Button>
                    
                    }
             
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default UserEducation
// UserExperience