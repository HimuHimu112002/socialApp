import React, { useState,useEffect } from 'react'
import { useSelector} from 'react-redux';
import {Container, Row, Col,Form, Button,Modal} from 'react-bootstrap';
import { BiPencil } from 'react-icons/bi';
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database"
import Swal from 'sweetalert2'


const ProfileAbout = () => {
  const db = getDatabase();
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  let [aboutDiscriptions, setprofileDiscriptions] = useState(false)
  let [about, setabout] = useState("")
  let [postAbouterror, setpostAbouterror] = useState("")
  let [showabout, setshowabout] = useState([])
  let [Id, setid] = useState(false)
  let [modelShow, setmodelShow] = useState(false)

  let handleAboutDescriptionInput =(e)=>{
    setabout(e.target.value)
  }
  let handleAboutDescriptionSubmit =()=>{
    if(!about){
      setpostAbouterror("Write some about here.")
    }
    if(about){
      set(push(ref(db, 'about')),{
        post:about,
        whopost:data.uid,
       })
    }

  }

  useEffect(()=>{
    onValue(ref(db, 'about'), (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        if(item.val().whopost == data.uid){
          arr.push({...item.val(), id:item.key})
  
        }
      });
      setshowabout(arr);
      });
  }, [])

  // about update id
  let handleUpdateAbout = (id)=>{
    setid(id)
    setmodelShow(true)
  }
  let handleClose = ()=>{
    setmodelShow(false)
    update(ref(db, 'about/' + Id), {
      post:about,
    })
  }
  let modelcansel =()=>{
    setmodelShow(false)
  }

  let handleDelete = (id)=>{
    Swal.fire({
    title: 'Are you sure?',
    text: "Deleted your's about details.",
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
      remove(ref(db, 'about/' + id))
        Swal.fire(
        'Deleted!',
        'Your post has been deleted.',
        'success'
        )
      }
    })
  }

return (
    <Container className='aboutSection shadow'>
        <Row >
            <Col >
                <div>
                    <h1 className='text-white'>About<BiPencil onClick={()=>setprofileDiscriptions(!aboutDiscriptions)}></BiPencil></h1>
                </div>
                  
                {aboutDiscriptions &&
                  <>
                    <div className='post_input-section d-flex'>
                      {showabout.length == 0 &&
                        <>

                          <Form.Control onChange={handleAboutDescriptionInput} size="lg" as="textarea" rows={3} placeholder="Write About Discriptions" />
                          <Button onClick={handleAboutDescriptionSubmit} className='post_input-button' variant="primary">Save</Button>

                        </>
                      }
                    </div>
                    <p className='text-danger'>{postAbouterror}</p>
                  </>
                }

              {showabout.map((item)=>( 
                <>
                <p className='mt-3 text-white'>{item.post}</p>
                <Button className='about_delete_button' onClick={()=>handleUpdateAbout(item.id)}>Update</Button>
                <Button className='postDeleteButton' onClick={()=>handleDelete(item.id)}>Delete</Button>
                </>            
              ))}

              {/* Bio updating modal  start ======================   */}
                <Modal show={modelShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Write Updating discriptions</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasictext">
                      <Form.Label>Updating About.</Form.Label>
                      <Form.Control className='job_discriptions_border' onChange={handleAboutDescriptionInput} as="textarea" rows={3}/>
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
    </Container>

  )
}

export default ProfileAbout