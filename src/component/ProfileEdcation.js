import React, {useEffect, useState} from 'react'
import {Container, Row, Col,Button,Form,Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector} from 'react-redux';
import { getDatabase, ref, onValue, remove, update } from "firebase/database"
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'

const ProfileEdcation = () => {
    let [showaexperience, setshowaexperience] = useState([])
    const db = getDatabase();
    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    let [Id, setid] = useState(false)
    let [modelShow, setmodelShow] = useState(false)

    let [discriptions, setdiscription] = useState("")
    let [discriptionserror, setdiscriptionserror] = useState(false)

    let [experience, setexperience] = useState("")
    let [experienceerro, setexperienceerro] = useState(false)

    let [position, setposition] = useState("")
    let [positionerro, setpositionerro] = useState(false)

    let [skill, setskill] = useState("")
    let [skillerror, setskillerror] = useState(false)

    let Skill = (e)=>{
        setskill(e.target.value)
    }
    let Position = (e)=>{
        setposition(e.target.value)
    }
    let Experience = (e)=>{
        setexperience(e.target.value)
    }
    let handleDiscription = (e)=>{
        setdiscription(e.target.value)
    }

    useEffect(()=>{
        onValue(ref(db, 'education'), (snapshot) => {
          let arr = []
          snapshot.forEach((item)=>{
            if(item.val().whopost == data.uid){
              arr.push({...item.val(), id:item.key})
      
            }
          });
          setshowaexperience(arr);
          });
    }, [])

    let handleUpdateExperience =(id)=>{     
        setid(id)
        setmodelShow(true)
    }

    let handleClose = ()=>{
        toast.success("Upload Successfull.");    
        
         if(!skill){
            setskillerror("Skill is required")
        }
        if(!position){
            setpositionerro("Skill is required")
        }
        if(!experience){
            setexperienceerro("Skill is required")
        }
        if(!discriptions){
            setdiscriptionserror("Skill is required")
        }
        if(skill && position && experience && discriptions){
            update(ref(db, 'education/' + Id),{
                Skill:skill,
                comment:discriptions,
                experience:experience,
                position:position,

            }).then(()=>{
                setTimeout(()=>{
                    setmodelShow(false)        
                },3000)
            })
        }
    }

    let modelcansel =()=>{
        setmodelShow(false)
    }

    let handleDelete = (id)=>{
        Swal.fire({
        title: 'Are you sure?',
        text: "Deleted your's education",
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
            remove(ref(db, 'education/' + id))
            Swal.fire(
            'Deleted!',
            'Your post has been deleted.',
            'success'
            )
        }
        })
    }

return (
    <Container>
    <ToastContainer position="top-right" theme="dark"/>
    <Row >
        <Col >
            <div className='educationSection shadow rounded'>
                <div className=''>
                    <h1 className='experience_text text-white'>Educ<span>ation</span></h1>
                    <Link to="/education"><Button variant="success">ADD YOUR'S EDUCATION</Button></Link>
                </div>
                {showaexperience.map((item)=>(
                <div className='d-flex mt-4 experience_border'>

                    <div className='experience_content'> 
                        <img src={item.image}></img>
                    </div>
                    <div className='mb-3'>
                                                    
                        <h5 className='text-white'>{item.Skill}</h5>
                        <div className='d-flex'>
                            <p className='experience_text text-white'>{item.position}</p>
                        </div>
                        <div  className='d-flex'>
                            <p className='experience_text text-white'>{item.experience}</p>
                        </div>
                        <p className='text-white'>{item.comment}</p>
        
                        <Button onClick={()=>handleUpdateExperience(item.id)} className='about_delete_button' variant="success">Update </Button>
                        <Button onClick={()=>handleDelete(item.id)} className='postDeleteButton'>Delete</Button>
                                                       
                    </div>
                </div>
                ))}             
            </div>
            
            {/* Bio updating modal  start ======================   */}
            <Modal show={modelShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Updating Work Experience</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>University Name</Form.Label>
                        <Form.Control onChange={Skill} type="email" placeholder="University Name" />
                    </Form.Group>
                    <p className='danger'>{skillerror}</p>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Collage Name</Form.Label>
                        <Form.Control onChange={Position} type="email" placeholder="Position" />
                    </Form.Group>
                    <p>{positionerro}</p>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Passing Year</Form.Label>
                        <Form.Control onChange={Experience} type="email" placeholder="Experience" />
                    </Form.Group>
                    <p>{experienceerro}</p>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Education Discription</Form.Label>
                        <Form.Control onChange={handleDiscription} as="textarea" rows={3} />
                    </Form.Group>
                    <p>{discriptionserror}</p>
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
    </Container>
  )
}

export default ProfileEdcation