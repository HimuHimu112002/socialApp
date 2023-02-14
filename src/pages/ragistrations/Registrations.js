import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import { AiOutlineUser, AiOutlineMail, AiFillEye, AiTwotoneEyeInvisible } from 'react-icons/ai';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBar } from 'react-loader-spinner'

const Registrations = () => {
    // for firebase authentication
    const auth = getAuth();

    // for firebase realtime
    const db = getDatabase();

    // for redirect
    let navigate = useNavigate();
    
    let [userName, setuserName] = useState("")
    let [userEmail, setuserEmail] = useState("")
    let [userpassword, setuserpassword] = useState("")

    let [userNameerror, setuserNameerror] = useState("")
    let [userEmailerror, setuserEmailerror] = useState("")
    let [userpassworderror, setuserpassworderror] = useState("")
    let [smsSuccess, setsmsSuccess] = useState("")
    let [passShow, setpassShow] = useState(false)
    let [loading, setloading] = useState(false)

    let handleRegistrationsName = (e)=>{
        setuserName(e.target.value)
        setuserNameerror("")
    }
    let handleRegistrationsEmal = (e)=>{
        setuserEmail(e.target.value)
        setuserEmailerror("")
    }
    let handleRegistrationsPassword = (e)=>{
        setuserpassword(e.target.value)
        setuserpassworderror("")
    }

    let handleRegistrationsSubmit = ()=>{
        if(!userName){
            setuserNameerror("Please Input Your Name Here !")
        }
        if(!userEmail){
            setuserEmailerror("Please Input Your Email Here !")
        }
        if(!userpassword){
            setuserpassworderror("Please Input Your Password Here !")
        }
        if(userName && userEmail && userpassword){
            setloading(true)
            createUserWithEmailAndPassword(auth, userEmail, userpassword).then((user) => {
            setsmsSuccess("🥰Registration Successfull Please Verifications your's Email")
               updateProfile(auth.currentUser, {
                displayName: userName, 
                photoURL: "image/vactor.png"
              }).then(() => {
                toast.success("Registration Successfull. Thank you.");
                setuserName("");
                setuserEmail("");
                setuserpassword("");
                sendEmailVerification(auth.currentUser)
                setloading(false)
                setTimeout(()=>{
                    setsmsSuccess("")
                },2000)
                setTimeout(()=>{
                    navigate("/login")
                },4000)                
                
              }).then(()=>{
                set(ref(db, 'users/' + user.user.uid), { 
                    username: userName,
                    email: userEmail,
                    
                });               
                })
              
            }).catch((error) => {
                if(error.code.includes("auth/email-already-in-use")){
                    setuserEmailerror("This Email already in used")
                }
                setloading(false)
                
            });
        }
        
    }

return (
    <div className=''>
        <Container className='registration_top'>
        <ToastContainer position="top-right" theme="dark"/>
            <Row className='res shadow-md rounded'>
                <div className='text-center mb-3 registration_text'><h1><span>Registration</span> Here</h1></div>
                <div className='text-center mb-3 text-primary'><p>{smsSuccess}</p></div>
                <Col md="6" className='mt-1'>

                    <FloatingLabel className='registration_icon--section' onChange={handleRegistrationsName} controlId="floatingInput" label="Your's name here">
                        <Form.Control size="sm" type="text" placeholder="Name" />
                        <AiOutlineUser className='registration_icon'></AiOutlineUser>
                    </FloatingLabel>
                    <p className='text-danger'>{userNameerror}</p>

                    <FloatingLabel className='registration_icon--section' onChange={handleRegistrationsEmal} controlId="floatingInput" label="Email address" className="mt-3">
                        <Form.Control type="email" placeholder="name@example.com" />
                        <AiOutlineMail className='registration_icon'></AiOutlineMail>
                    </FloatingLabel>
                    <p className='text-danger'>{userEmailerror}</p>

                    <FloatingLabel className='registration_icon--section' onChange={handleRegistrationsPassword} controlId="floatingPassword" label="Password" className="mt-3">
                        <Form.Control type={passShow ? "text":"password"} placeholder="Password" />
                        {passShow ?
                        <AiFillEye onClick={()=>setpassShow(!passShow)} className='registration_icon'></AiFillEye>
                        
                         :
                        <AiTwotoneEyeInvisible onClick={()=>setpassShow(!passShow)} className='registration_icon'></AiTwotoneEyeInvisible>
                         
                        }
                    </FloatingLabel>
                    <p className='text-danger'>{userpassworderror}</p>

                    {loading ?
                    <div className='text-center'>
                    <ProgressBar
                        height="80"
                        width="80"
                        ariaLabel="progress-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass="progress-bar-wrapper"
                        borderColor = '#fff'
                        barColor = '#51E5FF'
                    />
                    </div>
                    
                    :
                    <Button onClick={handleRegistrationsSubmit} className='mt-4 w-100 login_button'>Sign-up</Button>
                    
                    }

                    <p className='registration_sub--heading text-center mt-3 text-primary'>👉 Already You have an account <Link to="/login"><span>Log-in</span></Link></p>
                </Col>

                <Col md="6">
                    <img src='image/sign.png' className='img-fluid'></img>
                </Col>

            </Row>
      </Container>
    </div>
  )
}

export default Registrations