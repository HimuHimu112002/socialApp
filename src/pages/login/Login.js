import React, {useState} from 'react'
import { Button, Form,Container,Row,Col } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Link,useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { AiOutlineMail, AiFillEye, AiTwotoneEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';
import { ProgressBar } from 'react-loader-spinner'


const Login = () => {
    const dispatch = useDispatch();
    const auth = getAuth();
    let navigate = useNavigate();

    let [userEmail, setuserEmail] = useState("")
    let [userpassword, setuserpassword] = useState("")

    let [userEmailerror, setuserEmailerror] = useState("")
    let [userpassworderror, setuserpassworderror] = useState("")
    let [smsSuccess, setsmsSuccess] = useState("")
    let [passShow, setpassShow] = useState(false)
    let [loading, setloading] = useState(false)


    let handleuserLoginEmail = (e)=>{
        setuserEmail(e.target.value)
        setuserEmailerror("")
    }
    let handleuserLoginPassword = (e)=>{
        setuserpassword(e.target.value)
        setuserpassworderror("")
    }

    let handleLoginSubmit = ()=>{
        if(!userEmail){
            setuserEmailerror("Please Input Your Email Here !")
        }
        if(!userpassword){
            setuserpassworderror("Please Input Your Password Here !")
        }
        if( userEmail && userpassword){
            setloading(true)
            signInWithEmailAndPassword(auth, userEmail, userpassword).then((user) => {
                setsmsSuccess("😍Login Successfull.")
                toast.success("Login Successfull Please Wait Thank you.");
                
                dispatch(userLoginInfo(user.user))
                localStorage.setItem("userInfo", JSON.stringify(user.user))
                setTimeout(()=>{
                    setsmsSuccess("")
                },2000)
                setTimeout(()=>{
                    setloading(false)
                    navigate("/")
                },3000) 
    
            }).then(()=>{
                setuserEmail("")
            }).catch((error) => {
                const errorCode = error.code;
                if(errorCode.includes("auth/user-not-found")){
                    setuserEmailerror("Email Not Found")
                    setloading(false)
                }
                if(errorCode.includes("auth/network-request-failed")){
                    setuserEmailerror("Network Connection Not Found")
                    setloading(false)
                }
                if(errorCode.includes("auth/wrong-password")){
                    setuserpassworderror("Password not matching")
                    setloading(false)
                }               

            });
  
        }
       
    }
return (
    <>
        <Container className='registration_top'>
        <ToastContainer position="top-right" theme="dark"/>
            <Row className='res rounded'>
                <div className='text-center mb-3 registration_text'><h1><span>Login</span> Here</h1></div>
                <div className='text-center mb-3 text-primary'><p>{smsSuccess}</p></div>
                <Col md="6">

                    <FloatingLabel className='registration_icon--section' onChange={handleuserLoginEmail} controlId="floatingInput" label="Email address" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" />
                        <AiOutlineMail className='registration_icon'></AiOutlineMail>
                    </FloatingLabel>
                    <p className='text-danger'>{userEmailerror}</p>

                    <FloatingLabel className='registration_icon--section' onChange={handleuserLoginPassword} controlId="floatingPassword" label="Password">
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

                    <Button onClick={handleLoginSubmit} className='mt-4 w-100 login_button'>Login</Button>
                    
                    }

                    <p className='registration_sub--heading text-primary text-center mt-3'>👉 You don't have an account <Link to="/ragistrations"><span>Sign-up</span></Link></p>
                    <p className='registration_sub--heading text-primary text-center mt-3'><Link to="/forgotPassword">Forgot Password</Link></p>
                </Col>

                <Col md="6">
                    <img src='image/login.jpg' className='img-fluid'></img>
                </Col>

            </Row>
      </Container>
    </>
  )
}

export default Login