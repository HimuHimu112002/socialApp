import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { AiOutlineMail } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBar } from 'react-loader-spinner'

const ForgotPass = () => {
    const auth = getAuth();
    let navigate = useNavigate();

    let [forgotEmail, setforgotEmail] = useState("")
    let [smsSuccess, setsmsSuccess] = useState("")
    let [loading, setloading] = useState(false)

    let handleEmailForgot = (e) =>{
        setforgotEmail(e.target.value)
    }

    let handleForgotPassword = () =>{
        setloading(true)
        sendPasswordResetEmail(auth, forgotEmail).then(() => {
            setsmsSuccess("😍Check your's Email And Click The Verifications Link !")
            toast.success("😍Email Send Successfull Please Wait Thank you.");
            
            setTimeout(()=>{
                setsmsSuccess("")
                setloading(false)
            },2000)
            setTimeout(()=>{
                navigate("/login")
            },3000) 
        })

    }

return (
    <>
        <Container className='registration_top'>
        <ToastContainer position="top-right" theme="dark"/>
            <Row className='res shadow rounded'>
                <div className='text-center mb-3 registration_text'><h1>Your's <span>Email</span> Here</h1></div>
                <div className='text-center mb-3 registration_text'><p>👉 Input Your's email Here and click the send button then check your's email address and click the link thank you.</p></div>
                <div className='text-center mb-3 text-primary'><p>{smsSuccess}</p></div>
                <Col md="6" className='mt-1'>
                    <FloatingLabel className='registration_icon--section' onChange={handleEmailForgot} controlId="floatingInput" label="Email address" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" />
                        <AiOutlineMail className='registration_icon'></AiOutlineMail>
                    </FloatingLabel>

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
                    <Button onClick={handleForgotPassword} className='mt-4 w-100 login_button'>Send</Button>
                   
                    }

                    <p className='registration_sub--heading text-primary text-center mt-3'>👉 If you don't want to reset the password click the login button.</p>
                    <p className='registration_sub--heading text-primary text-center mt-3'><Link to="/login"><span>Login</span></Link></p>

                </Col>

                <Col md="6">
                    <img src='image/forgot2.jpeg' className='img-fluid'></img>
                </Col>

            </Row>
      </Container>
    </>
  )
}

export default ForgotPass