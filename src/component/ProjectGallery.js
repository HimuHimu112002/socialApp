import React,{useEffect,useState} from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { getAuth} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { onValue, remove } from "firebase/database";
import "cropperjs/dist/cropper.css";
import { getStorage, ref as sref,getDownloadURL, ref as storageref, uploadBytesResumable } from "firebase/storage";
import { useSelector} from 'react-redux';
import { AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2'

const ProjectGallery = () => {

    const auth = getAuth();
    const storage = getStorage();
    let data = useSelector((state)=> state.userLoginInfo.userInfo)
    const db = getDatabase();
    
    // profile img upload
    const [showproject, setshowproject] = useState([]);
  
    let handleProjectUpload = (e)=>{
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
          set(push(ref(db, "project")),{
            sendername: data.uid,
            image:downloadURL,
            
          })
        });
      }
    );
    }

    useEffect(()=>{
        onValue(ref(db, 'project/'), (snapshot) => {
          let arr = []
          snapshot.forEach((item)=>{       
              arr.push({...item.val(), id:item.key})
           
          });
          setshowproject(arr);
          });
      }, [])
   

      let handleProjectDelete = (id)=>{
        Swal.fire({
        title: 'Are you sure?',
        text: "Deleted this project image",
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
            remove(ref(db, 'project/' + id))
            Swal.fire(
            'Deleted!',
            'Your post has been deleted.',
            'success'
            )
        }
        })
      }

return (
    <Container className='mt-4'>
        <Row className='shadow gallery_main-section'>
            <div className='flex'>
            <h1 className='mb-4 text-white project_heading'>Add <span>Project</span></h1>
            <label>
                <input onChange={handleProjectUpload} className='mb-4 project_input' type="file"></input>
                <h5 className='project_button'> Add Project</h5>
            </label>
            </div>
            
            {showproject.map((item)=>(
                (data.uid == item.sendername &&
                (<Col md="4">
                    <div className='project_img'>
                        <img className='w-100' src={item.image}></img>
                        <div onClick={()=>handleProjectDelete(item.id)} className='overly'><AiFillDelete></AiFillDelete></div>                
                    </div>
                </Col>))
            ))}
            
        </Row>
    </Container>
  )
}

export default ProjectGallery