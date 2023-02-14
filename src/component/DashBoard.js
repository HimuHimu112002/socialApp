import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux';
import { Col, Container, Row,Button } from 'react-bootstrap'
import { getDatabase, ref, onValue, remove} from "firebase/database";
import Swal from 'sweetalert2'

const DashBoard = () => {
    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    const db = getDatabase();

    let [showPost, setshowPost] = useState([])

    useEffect(()=>{
        onValue(ref(db, 'post'), (snapshot) => {
          let arr = []
          snapshot.forEach((item)=>{
            if(item.val().whopost == data.uid){
              arr.push({...item.val(), id:item.key})
    
            }
          });
          setshowPost(arr);
          });
    
    },  [])

    // let handleDelete = (id)=>{
    //     remove(ref(db,'post/',+ id))
    //     post er pore comma dile all post delete hoiye jabe
    //     remove(ref(db, 'post/' + id))
    // }

    // sweet alert section start

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
            remove(ref(db, 'post/' + id))
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
        <Row className='dashboard_main-center--section'>
            <Col md="12" className='shadow'>
                <div className='dashbord_profile mt-4'>
                    <img src={data.photoURL}></img>
                </div>
                    <h5 className='text-center mt-2 text-white'>User :{data.displayName}</h5>
                <div className='dashboard_main-section mt-4'>
                                                  
                <div className='total_post w-80 h-80 m-auto'>
                    {showPost.map((item)=>(
                        <div className='dashboard_bg_color shadow-sm rounded'>
                            <div className='dashboard_post_align'>
                                <div>
                                    <h4 className='text-white'>{item.username}</h4>
                                    <p className='text-white'>{item.postTitle}</p>
                                </div>
                                <div>
                                    {data.uid == item.whopost &&                               
                                    <Button onClick={()=>handleDelete(item.id)}  variant="danger">Delete</Button>                                  
                                        }
                                </div>
                            </div>
                            <p className='text-white'>{item.postDiscription}</p>
                        </div>
                    ))}
                </div>                
                </div>
            </Col>
        </Row>
    </Container>
  )
}

export default DashBoard