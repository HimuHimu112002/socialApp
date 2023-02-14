import React, { useState, useEffect } from 'react'
import {Form,Container,Row,Col,Button} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { getDatabase, ref, set, push,onValue } from "firebase/database";
import { GrGallery } from 'react-icons/gr';
import {getStorage,ref as storageref, uploadBytesResumable, uploadString,getDownloadURL,uploadBytes } from "firebase/storage";
import { RotatingLines } from 'react-loader-spinner'
import { RxCross2 } from 'react-icons/rx';

const PostPage = () => {

    let navigate = useNavigate();
    let data = useSelector((state)=> state.userLoginInfo.userInfo)
    const db = getDatabase();

    const storage = getStorage();


    let [postTtitle, setpostTtitle] = useState("")
    let [postDiscription, setpostDiscription] = useState("")

    let [postImgTtitle, setpostImgTtitle] = useState("")
    let [postImgDiscription, setpostImgDiscription] = useState("")

    let [posterror, setposterror] = useState("")
    let [postDiscriptionerror, setpostDiscriptionerror] = useState("")

    let [postImgerror, setpostImgerror] = useState("")
    let [postImgDiscriptionerror, setpostImgDiscriptionerror] = useState("")

    let [ImgUpload, setImgUpload] = useState(false)
    let [loading, setloading] = useState(false)

    let [showImgPost, setshowImgPost] = useState([])
    let [PostImg, setPostImg] = useState([])

    let handlePostTitle = (e) =>{
        setpostTtitle(e.target.value)
        setposterror("")
    }
    let handlePostDiscription = (e) =>{
        setpostDiscription(e.target.value)
        setpostDiscriptionerror("")
    }

    let handlePost = ()=>{
        if(!postTtitle){
            setposterror("Write the post title.")
        }
        if(!postDiscription){
            setpostDiscriptionerror("Write the some post discriptions.")
        }
        toast.success("Post Create Successfull.");
        if(postTtitle && postDiscription){
            setloading(true)
            set(push(ref(db, 'post')),{
              postTitle:postTtitle,
              postDiscription:postDiscription,
              whopost:data.uid,
              username:data.displayName,
              date:`${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getFullYear()}`
             })
          }
        
        setTimeout(()=>{
            setloading(false)
            navigate("/")
        },2000)
    }

    let handlePostcancel = ()=>{
        setTimeout(()=>{
            navigate("/")
        })
    }

    // img upload section start
    let handleImagePostTitle =(e)=>{
        setpostImgTtitle(e.target.value)
        setpostImgerror("")
    }
    let handleImagePostDiscription = (e) =>{
        setpostImgDiscription(e.target.value)
        setpostImgDiscriptionerror("")
    }

    let handleImgUploadcancel = ()=>{
        setImgUpload(false)
        
    }

    // post img upload secton start ========================>

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

let handleImagePost = ()=>{
    toast.success("Post Create Successfull.");
    setloading(true)
    set(push(ref(db, "single")),{
        postImg: postImgTtitle,
        postDis:postImgDiscription,
        whosendid: data.uid,
        whosendname: data.displayName,
        image:PostImg,
        date:`${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getFullYear()}`
      }).then(()=>{
        setTimeout(()=>{
            setloading(false)
            navigate("/")
        },3000)
      })
    setTimeout(()=>{
        navigate("/")
    },2000)
    
}


// boxer majhe post img show 
useEffect(()=>{
    onValue(ref(db, 'single/'), (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{       
        arr.push({...item.val(), id:item.key})       
      });
      setshowImgPost(arr);
      });
}, [])

let handlCross = ()=>{
    navigate("/")
  }

return (

    <div className='BodyBg'>
        <Container>
        <ToastContainer position="top-right" theme="dark"/>
            <Row className='job_main_section'>
            
                {ImgUpload ?
                    <Col md="6" className='m-auto job_post_section rounded-2 shadow'>
                        <span><RxCross2 onClick={handlCross} className='cross_icon'></RxCross2></span>
                        <div className='popUp'>
                        <h1 className='text-center mb-5 text-white'>Create A New Post</h1>
                        <Form>
                            <Form.Group onChange={handleImagePostTitle} className="mb-5 gallery_icon_main" controlId="exampleForm.ControlInput1">
                                <Form.Label className='job_discriptions text-white'>Write your's job title</Form.Label>
                                <Form.Control className='job_discriptions_border' type="text" placeholder="Job title" />
                                <p className='text-danger mt-1'>{postImgerror}</p>
                            </Form.Group>

                            <Form.Group onChange={handleImagePostDiscription} className="mb-3 " controlId="exampleForm.ControlTextarea1">
                                <Form.Label className='job_discriptions text-white'>Write your's job discriptions</Form.Label>
                                <Form.Control className='job_discriptions_border' as="textarea" rows={3} />
                                <p className='text-danger mt-1'>{postImgDiscriptionerror}</p>
                            </Form.Group>

                            <Form.Group controlId="formFileSm" className="mb-3">
                                <Form.Label className='text-white'>Chose Your image here</Form.Label>
                                <Form.Control  onChange={handleImageUpload}  type="file" size="sm" />
                            </Form.Group>
                            
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
                                <Button onClick={handleImagePost} className='Img_post_button mx-2' variant="success">Post</Button>               
                                                                    
                            }
                            <Button onClick={handleImgUploadcancel} className='Imgcancel_button' variant="danger">Back</Button>
                        </div>          
                        </div>
                    </Col>
                
                :
                
                    <Col md="6" className='m-auto job_post_section rounded-2'>
                    <span><RxCross2 onClick={handlCross} className='cross_icon'></RxCross2></span>
                        <h1 className='text-center mb-5 text-white'>Create A New Post</h1>
                        <Form>
                            <Form.Group onChange={handlePostTitle} className="mb-5 gallery_icon_main" controlId="exampleForm.ControlInput1">
                                <Form.Label className='job_discriptions text-white'>Write your's post title</Form.Label>
                                <Form.Control className='job_discriptions_border' type="text" placeholder="Job title" />
                                <GrGallery onClick={()=>setImgUpload(!ImgUpload)} className='gallery'></GrGallery>
                                <p className='text-danger mt-1'>{posterror}</p>
                            </Form.Group>

                            <Form.Group onChange={handlePostDiscription} className="mb-3 " controlId="exampleForm.ControlTextarea1">
                                <Form.Label className='job_discriptions text-white'>Write your's post discriptions</Form.Label>
                                <Form.Control className='job_discriptions_border' as="textarea" rows={3} />
                                <p className='text-danger mt-1'>{postDiscriptionerror}</p>
                            </Form.Group>
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
                                    <Button onClick={handlePost} className='w-100 ' variant="success">Submit</Button>               
                                                                        
                                }

                        </div>
                                
                    </Col>
                }               
            </Row>
        </Container>
    </div>
  )
}

export default PostPage