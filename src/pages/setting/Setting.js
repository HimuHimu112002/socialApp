import React,{useEffect,useState} from 'react'
import {Container, Row, Col, Form, Button, Modal} from 'react-bootstrap';
import { RxUpdate } from 'react-icons/rx';
import { GrLogout } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';
import { getDatabase, ref, onValue, update } from "firebase/database"
import { useSelector} from 'react-redux';

const Setting = () => {

    let data = useSelector((state)=> state.userLoginInfo.userInfo)
    const auth = getAuth();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const db = getDatabase();
    let [userName, setUserName] = useState([])
    let [modelShow, setmodelShow] = useState(false)
    let [Id, setid] = useState(false)
    let [UpdateUserName, setUpdateUserName] = useState("")




    let handleLogout =()=>{
        signOut(auth).then(() => {
            dispatch(userLoginInfo(null))
            localStorage.removeItem("userInfo")
            navigate("/login")
            
        })
    }


    useEffect(()=>{
        const starCoverRef = ref(db, 'users/');
        onValue(starCoverRef, (snapshot)=>{
          let arr = []
          snapshot.forEach((item)=>{
            if(data.displayName == item.val().username){
                arr.push({...item.val(), id: item.key})

            }
            
          });
          setUserName(arr)
        });
    },[])

    let handleUserNameUpdate=(id)=>{
        setid(id)
        setmodelShow(true)
    }

    let handleUserInput = (e) =>{
        setUpdateUserName(e.target.value)
        
    }
      
    let handleClose = ()=>{
        setmodelShow(false)
        update(ref(db, 'users/' + Id), {
            username:UpdateUserName,
        })
        
    }
      
    let modelcansel =()=>{
        setmodelShow(false)
    }

  return (
    <Container>
        <Row className='setting_row'>
            <Col className='shadow py-5'>
                <h1 className='text-center'>Setting</h1>

                <div className='update_user--name'>
                    <h5><RxUpdate></RxUpdate></h5>
                    <h5>Update User Name</h5>
                </div>
                {userName.map((item)=>(
                    <div onClick={()=>handleUserNameUpdate(item.id)} className='userNameEdit'>
                        <p>{item.username}</p>
                    </div>
                ))}

                <label onClick={handleLogout} className='update_user--logout'>
                    <h5><GrLogout></GrLogout></h5>
                    <h5>Log-Out</h5>
                </label>

                <Link to="/"><Button className='mt-5' variant="success">Back</Button></Link>
            </Col>
        </Row>

         {/* Bio updating modal  start ======================   */}
      
      <Modal show={modelShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Updating Name</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasictext">
            <Form.Label>Updating Name.</Form.Label>
            <Form.Control className='job_discriptions_border' onChange={handleUserInput} type="text"/>
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
    </Container>
  )
}

export default Setting