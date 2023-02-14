import React, { useState,useEffect } from 'react'
import {Container,Row, Col,Form, Button} from 'react-bootstrap';
import { getDatabase, ref, set, push, onValue, update, remove } from "firebase/database"
import { Link,useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { RotatingLines } from 'react-loader-spinner'
import { RxCross2 } from 'react-icons/rx';

const Contact = () => {
  const db = getDatabase();
  let navigate = useNavigate();
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  let [showContact, setshowContact] = useState([])

  // contact section
  let [email, setemail] = useState("")
  let [name, setname] = useState("")
  let [phone, setphone] = useState("")
  let [textarea, settextarea] = useState("")
  let [emailerror, setemailerror] = useState("")
  let [nameerror, setnameerror] = useState("")
  let [phoneerror, setphoneerror] = useState("")
  let [textareaerror, settextareaerror] = useState("")
  let [loading, setloading] = useState(false)

  // update section
  let [emailupdate, setemailupdate] = useState("")
  let [nameupdate, setnameupdate] = useState("")
  let [phoneupdate, setphoneupdate] = useState("")
  let [textareaupdate, settextareaupdate] = useState("")
  let [emailerrorupdate, setemailerrorupdate] = useState("")
  let [nameerrorupdate, setnameerrorupdate] = useState("")
  let [phoneerrorupdate, setphoneerrorupdate] = useState("")
  let [textareaerrorupdate, settextareaerrorupdate] = useState("")

  let handleContactEmail = (e)=>{
    setemail(e.target.value)
    setemailerror("")
  }
  let handleContactText = (e)=>{
    setname(e.target.value)
    setnameerror("")
  }
  let handleContactPhone = (e)=>{
    setphone(e.target.value)
    setphoneerror("")
  }
  let handleContactTextArea = (e)=>{
    settextarea(e.target.value)
    settextareaerror("")
  }
  let handleSubmit = ()=>{
    toast.success("Add Contact Info Successfull");
    if(!email){
      setemailerror("Email is required")
    }
    if(!name){
      setnameerror("Name is required")
    }
    if(!phone){
      setphoneerror("Phone is required")
    }
    if(!textarea){
      settextareaerror("Text is required")
    }
    if(email && name && phone && textarea){
      set(push(ref(db, 'contact')),{
        email:email,
        name:name,
        phone:phone,
        comment:textarea,
        whopost:data.uid,
       }).then(()=>{
          setTimeout(()=>{
            navigate("/profile")
          },3000)
       }) 
    }
  }

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

  // Contact update Section 

  let handleContactEmailUpdate = (e)=>{
    setemailupdate(e.target.value)
    setemailerrorupdate("")
  }
  let handleContactTextUpdate = (e)=>{
    setnameupdate(e.target.value)
    setnameerrorupdate("")
  }
  let handleContactPhoneUpdate = (e)=>{
    setphoneupdate(e.target.value)
    setphoneerrorupdate("")
  }
  let handleContactTextAreaUpdate = (e)=>{
    settextareaupdate(e.target.value)
    settextareaerrorupdate("")
  }
  let handleSubmitUpdate = (id)=>{
    setloading(true)
    if(!emailupdate){
      setemailerrorupdate("Email is required")
    }
    if(!nameupdate){
      setnameerrorupdate("Name is required")
    }
    if(!phoneupdate){
      setphoneerrorupdate("Phone is required")
    }
    if(!textareaupdate){
      settextareaerrorupdate("Text is required")
    }
    if(emailupdate && nameupdate && phoneupdate && textareaupdate){      
      update(ref(db, 'contact/'+id),{
        email:emailupdate,
        name:nameupdate,
        phone:phoneupdate,
        comment:textareaupdate,
        
      }).then(()=>{
        setloading(true) 
        toast.success("Update Successfull");
        setTimeout(()=>{
          navigate("/profile")
        },3000)
        
      })
    }
    setloading(false) 
  }

   // Contact update Section end

  // Contact alert Section 

  let handleAlert = ()=>{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Can't add a new contact information. Now you can updated only",
    })
  }

  // Contact sweet alert Section 

  let handleContactDelete = (id)=>{
    Swal.fire({
    title: 'Are you sure?',
    text: "Delete Your's Previous Contact",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#162030',
    confirmButtonBorder: 'border-none',
    confirmButtonMarginTop: '10px',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    padding:"70px",
    }).then((result) => {
    if (result.isConfirmed) {
        remove(ref(db, 'contact/' + id))
        Swal.fire(
        'Deleted!',
        'Your post has been deleted.',
        'success'
        )
    }
    })
  }

  // Contact sweet alert Section end

  let handlCross = ()=>{
    navigate("/profile")
  }

  return (
    <div className='BodyBg'>
      <Container>
        <Row className='contactInfo'>
          <Col className='m-auto updateCollam' md="5">
            <h1 className='text-center mb-4 text-white'>Contact With Us.</h1>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Email address</Form.Label>
                <Form.Control onChange={handleContactEmail} type="email" placeholder="name@example.com" />
              </Form.Group>
              <p className='text-danger'>{emailerror}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Name</Form.Label>
                <Form.Control onChange={handleContactText} type="text" placeholder="Name" />
              </Form.Group>
              <p className='text-danger'>{nameerror}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Phone Number</Form.Label>
                <Form.Control onChange={handleContactPhone} type="number" placeholder="Phone Number" />
              </Form.Group>
              <p className='text-danger'>{phoneerror}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label className='text-white'>Comment</Form.Label>
                <Form.Control onChange={handleContactTextArea} as="textarea" rows={3} />
              </Form.Group>
              <p className='text-danger'>{textareaerror}</p>
            </Form>

            <div className='contactButton'>
              {showContact.map((item)=>(             
                (showContact.length == 1 &&
                  <Button onClick={handleAlert} variant="danger">Send</Button>  
                )
                                                                  
              ))}

              {showContact.length == 0 && 
              
                <Button onClick={handleSubmit} className='contactButton' variant="success">Send</Button>                                                    
                                     
              }
              
              {showContact.map((item)=>(
                <Button onClick={()=>handleContactDelete(item.id)} className='contactCancelButton' variant="danger">Delete Previous Contact</Button>

              ))}
            </div>

          </Col>

          {/* update section */}
          <Col className='m-auto updateCollam' md="5">
          <ToastContainer position="top-right" theme="dark"/>
            <h1 className='text-center mb-4 text-white'>Update Contact</h1>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Email address</Form.Label>
                <Form.Control onChange={handleContactEmailUpdate} type="email" placeholder="name@example.com" />
              </Form.Group>
              <p className='text-danger'>{emailerrorupdate}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Name</Form.Label>
                <Form.Control onChange={handleContactTextUpdate} type="text" placeholder="Name" />
              </Form.Group>
              <p className='text-danger'>{nameerrorupdate}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text-white'>Phone Number</Form.Label>
                <Form.Control onChange={handleContactPhoneUpdate} type="number" placeholder="Phone Number" />
              </Form.Group>
              <p className='text-danger'>{phoneerrorupdate}</p>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label className='text-white'>Comment</Form.Label>
                <Form.Control onChange={handleContactTextAreaUpdate} as="textarea" rows={3} />
              </Form.Group>
              <p className='text-danger'>{textareaerrorupdate}</p>
            </Form>
            {showContact.map((item)=>(
              <>
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
                        <Button onClick={()=>handleSubmitUpdate(item.id)} className='contactButton' variant="success">Update</Button>                                                  
                    }
                   
                </div>       
                                                                    
              </>
              
            ))}

          </Col>         
          <RxCross2 onClick={handlCross} className='cross_icon'></RxCross2>
        </Row>
      </Container>
    </div>
  )
}

export default Contact
{/* <Link to="/profile"><Button className='contactCancelButton' variant="danger">Cancel</Button></Link> */}