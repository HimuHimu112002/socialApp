import React, { useState, useEffect } from 'react'
import {Container,Row, Col,Form, Button} from 'react-bootstrap';
import { useSelector} from 'react-redux';
import { BiPencil } from 'react-icons/bi';
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { Modal } from 'react-bootstrap';
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const HomePostSection = () => {
  let data = useSelector((state)=> state.userLoginInfo.userInfo);
  
  const db = getDatabase();
  let navigate = useNavigate();

  let [postUpdateId, setpostUpdateId] = useState(false)
  let [postDiscriptionId, setpostDiscriptionId] = useState(false)
  let [showPost, setshowPost] = useState([])
  let [showImgPost, setshowImgPost] = useState([])
  let [modelShow, setmodelShow] = useState(false) //profile
  let [modeposDiscriptiostshow, setmodeposDiscriptiostshow] = useState(false)
  let [modepostshow, setmodepostshow] = useState(false)
  let [postUpdate, setpostUpdate] = useState(false)
  let [postTitleUpdate, setpostTitleUpdate] = useState(false)
  let [FilterJob, setFilterJob] = useState([])
  
  /* profile post section start ===================*/

  useEffect(()=>{
    onValue(ref(db, 'post'), (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        if(item.val().whopost == data.uid || data.uid != item.val().whopost){
          arr.push({...item.val(), id:item.key})
        }
      });
      setshowPost(arr);
      });
  }, [])

  useEffect(()=>{
    onValue(ref(db, 'single/'), (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{       
        arr.push({...item.val(), id:item.key})       
      });
      setshowImgPost(arr);
      });
  }, [])
  

  /* redirect post page start ===================*/

  let handlePostPage =()=>{
    setTimeout(()=>{
      navigate("/postPage")
    })
  }

  /* redirect post page end ===================*/

  // post title update section start================== 
  let handleTitleModalClose=()=>{
    setmodelShow(false)
  }

  let handlePostTitleUpdate = (e)=>{
    setpostTitleUpdate(e.target.value)
  }

  let handleupdatedd =(id)=>{
    setmodepostshow(true)
    setpostUpdateId(id)
  }

  let modeTitletlcansel =()=>{
    setmodepostshow(false)
  }

  let handlemodalUpdate =()=>{
    setmodepostshow(false)
    update(ref(db, 'post/' + postUpdateId), {
      postTitle:postTitleUpdate,
    })
  }

  // post title update section end ================== 

  // post discription update section start================== 
  let handlePostModalClose =()=>{
    setmodelShow(false)
  }

  let handlePostDiscriptionUpdate = (e)=>{
    setpostUpdate(e.target.value)
  }

  let modepostlcansel =()=>{
    setmodeposDiscriptiostshow(false)
  }

  let handleDiscriptionUpdate=(id)=>{
    setmodeposDiscriptiostshow(true)
    setpostDiscriptionId(id)
  }

  let handlemodalDiscriptionUpdate =()=>{
    setmodeposDiscriptiostshow(false)
    update(ref(db, 'post/' + postDiscriptionId), {
      postDiscription:postUpdate
    })
  }
  
// post discription update section end ================== 

// searce section start ================== 
let filterArray = []
let handleSearch=(e)=>{
  showPost.filter((item)=>{
    if(item.postTitle.toLowerCase().includes(e.target.value.toLowerCase())){
      filterArray.push(item)
    }
    setFilterJob(filterArray)
  })
}

let handleDelete = (id)=>{
  Swal.fire({
  title: 'Are you sure?',
  text: "Deleted this post",
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
      remove(ref(db, 'post/' + id))
      Swal.fire(
      'Deleted!',
      'Your post has been deleted.',
      'success'
      )
  }
  })
}

let handlePostImgDelete = (id)=>{
  Swal.fire({
  title: 'Are you sure?',
  text: "Deleted this post",
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
      remove(ref(db, 'single/' + id))
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
      <Row>

        <div className='input_main--section border'>
          <h4 className='mb-4 jobpostTitle text-white'>Create a new <span>post and discriptions</span>.</h4>
          <div className='post_border'></div>
          <div className='post_input-section mb-3'>
            <Button className='post_create-button' onClick={handlePostPage}>Create a new post</Button>
            <Form.Control onChange={handleSearch} type="search" placeholder="Search job heare" className="me-2 mt-3" aria-label="Search"/>    
          </div>

          {/* Search section ===================== */}

          {FilterJob.length > 0
            ?
            (FilterJob.map((item)=>(
              <>
                <div className='post_section'>
                    <div className='d-flex'>
                        <div className='post_img'>
                          <img src={data.photoURL}></img>
                        </div>
                        <div className='post_userName mt-2 d-flex'>
                            <div>
                                <h3>{item.username}</h3>
                                <p>{item.postTitle}
                                    {data.uid == item.whopost &&
                                      <BiPencil onClick={()=>handleupdatedd(item.id)}></BiPencil>
                                    }
                                </p>
                            </div>
                            <div>
                                {data.uid == item.whopost &&                                  
                                   <Button className='postDeleteButton' onClick={()=>handleDelete(item.id)}>Delete</Button>                                  
                                }
                            </div>
                        </div>
                    </div>
                    <div className='post_text'>
                        <h6 className='text-white'>{item.postDiscription}
                            {data.uid == item.whopost &&
                            <BiPencil onClick={()=>handleDiscriptionUpdate(item.id)}></BiPencil>
                            }
                        </h6>
                    </div>
                </div>
                <p className='date_design'>{item.date}</p>
              </>
            )))     
            :
            (showPost.map((item)=>(
              <>
                <div className='post_section'>
                    <div className='d-flex'>
                        <div className='post_img'>
                          <img src={data.photoURL}></img>
                        </div>
                        <div className='post_userName mt-2 d-flex'>
                            <div>
                                <h3>{item.username}</h3>
                                <p>{item.postTitle}
                                    {data.uid == item.whopost &&
                                    <BiPencil onClick={()=>handleupdatedd(item.id)}></BiPencil>
                                    }
                                </p>
                            </div>
                            <div>
                                {data.uid == item.whopost &&                                  
                                  <Button className='postDeleteButton' onClick={()=>handleDelete(item.id)}>Delete</Button>                                  
                                }
                            </div>
                        </div>
                    </div>
                    <div className='post_text'>
                        <h6>{item.postDiscription}
                            {data.uid == item.whopost &&
                              <BiPencil onClick={()=>handleDiscriptionUpdate(item.id)}></BiPencil>
                            }
                        </h6>
                      <p className='date_design mt-3'>{item.date}</p>
                    </div>
                </div>
              </>
            )))     
          }

          {showImgPost.map((item)=>(
            <>
                <div className='post_section'>
                    <div className='d-flex'>
                        <div className='post_img'>
                          <img src={data.photoURL}></img>
                        </div>
                        <div className='post_userName mt-2 d-flex'>
                            <div>
                                <h3>{item.whosendname}</h3>
                                <p>{item.postImg}</p>
                            </div>
                            <div>
                                {data.uid == item.whosendid &&                                  
                                  <Button className='postDeleteButton' onClick={()=>handlePostImgDelete(item.id)}>Delete</Button>                                  
                                }
                            </div>
                        </div>
                    </div>
                    <div className='post_text'>
                        <h6>{item.postDis}</h6>
                    </div>
                    <div>
                      <img className='w-100' src={item.image}></img>
                    </div>
                </div>
                <p className='date_design'>{item.date}</p>
              </>
           
          ))}
            
        </div>

        {/* Post modal section */}
        
        <Col md="6">
        
          {/* post title modal  start ======================================= */}
          <Modal show={modepostshow} onHide={handleTitleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Write post title or discriptions.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Post title</Form.Label>
                <Form.Control onChange={handlePostTitleUpdate} type="text" placeholder="post title" />
              </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer className='text-center d-flex justify-content-center mb-2'>
            
              <Button variant="success" onClick={handlemodalUpdate}>
                Update
              </Button>

              <Button className='bg-danger' variant="secondary" onClick={modeTitletlcansel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* post title modal  end ================================= */}


          {/* post discription modal  start ===================================*/}
          <Modal show={modeposDiscriptiostshow} onHide={handlePostModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Write post title or discriptions.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Updating Post</Form.Label>
                <Form.Control onChange={handlePostDiscriptionUpdate} as="textarea" rows={3} />
              </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer className='text-center d-flex justify-content-center mb-2'>
            
              <Button variant="success" onClick={handlemodalDiscriptionUpdate}>
                Update
              </Button>

              <Button className='bg-danger' variant="secondary" onClick={modepostlcansel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* post title modal  end ================================*/}
        
        </Col>             
      </Row>   
    </Container>

  )
}

export default HomePostSection