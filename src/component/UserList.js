import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, remove,set,push } from "firebase/database";
import { Col, Container, Row,Button,Form   } from 'react-bootstrap';
import { useSelector, useDispatch} from 'react-redux';
import { active } from '../slices/activeChatSlice';

const UserList = () => {

    let data = useSelector((state)=> state.userLoginInfo.userInfo);
    let activeFriend = useSelector((state)=>state.active.activeInitial)
   
    const db = getDatabase();
    const dispatch = useDispatch()

    let [user, setuser] = useState([])
    let [friendrequestList, setfriendrequestList] = useState([])
    let [friendtList, setfriendtList] = useState([])
    let [friend, setfriend] = useState([])
    let [Confifriend, setConfifriend] = useState([])
    let [sms, setsms] = useState("")
    let [smserror, setsmserror] = useState("")
    let [smslist, setsmslist] = useState([])

    useEffect(()=>{
        onValue(ref(db, 'users/'), (snapshot) => {
            let arr = []
            snapshot.forEach((item)=>{
            if(data.uid!= item.key){
                arr.push({...item.val(), UserId:item.key})
            }
    
            });
            setuser(arr);
            });
    
    },  [])


    let handleFriendRequest = (item)=>{
        set(push(ref(db, 'friendrequest')),{
            senderid:data.uid,
            sendername:data.displayName,
            reciverid: item.UserId,
            recivername: item.username
        })
    }

    useEffect(()=>{
        const friendrequestRef = ref(db, 'friendrequest');
        onValue(friendrequestRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item)=>{
                arr.push(item.val().reciverid + item.val().senderid)
           
            });
                setfriendrequestList(arr);
            });
    
    },  [])

    useEffect(()=>{
        const friendrequestRef = ref(db, 'friendrequest');
        onValue(friendrequestRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item)=>{
                if(item.val().reciverid == data.uid){
                    arr.push({...item.val(), id: item.key})
                }
           
            });
                setfriendtList(arr);
            });
    
    },  [])

    let handleFriendRequestAccept = (item)=>{
        set(push(ref(db, 'friend')),{
            ...item,
        }).then(()=>{
            remove(ref(db, 'friendrequest/', item.id))
        })
    }

    useEffect(()=>{
        const friendRef = ref(db, 'friend');
        onValue(friendRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item)=>{
                arr.push(item.val().reciverid + item.val().senderid)
           
            });
                setfriend(arr);
            });
    
    },  [])

    useEffect(()=>{
        const friendRef = ref(db, 'friend');
        onValue(friendRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item)=>{
                if(data.uid == item.val().reciverid || data.uid == item.val().senderid){

                    arr.push({...item.val(), key: item.key})
                }
           
            });
                setConfifriend(arr);
            });
    
    },  [])

    let handleActiveGroup = (item)=>{
        if(item.reciverid == data.uid){
            dispatch(active({ status:"single",id: item.senderid, name: item.sendername}))
            localStorage.setItem("activeInitial", JSON.stringify({senderid: item.senderid, sendername: item.sendername}))

        }else{
            dispatch(active({status:"single", id: item.reciverid, name: item.recivername}))
            localStorage.setItem("activeInitial", JSON.stringify({reciverid: item.reciverid, recivername: item.recivername}))

        }
    }

    let handleSms = (e)=>{
        setsms(e.target.value)
        setsmserror("")
    }

    let handleSmsSubmit = ()=>{
        if(!sms){
            setsmserror("Please write some text.")
        }
        if(activeFriend.status == 'single'){
            if(sms){
                set(push(ref(db, 'sms')),{
                    whosendid: data.uid,
                    whosendname: data.displayName,
                    whoreciveid: activeFriend.id,
                    whorecivename: activeFriend.name,
                    msg:sms,
                }).then(()=>{
                    setsms("")
                })
            }
        }
    }

    useEffect(()=>{
        onValue(ref(db, 'sms'), (snapshot) =>{
            let arr = []
            snapshot.forEach((item)=>{
                if(item.val().whosendid == data.uid && item.val().whoreciveid == activeFriend.id || item.val().whoreciveid == data.uid && item.val().whosendid == activeFriend.id){
                    arr.push(item.val())
                }
            });
            setsmslist(arr)
        });

    }, [activeFriend.id])

return (
    <Container>
        <Row>
            <Col className='shadow-sm mb-4 py-4' md="4">
                <div className='total_user_section'>
                    
                    <h1 className='text-white mb-5'>User Name</h1>
                    {user.map((item)=>(

                        <div className='userSection'>
                            <div className='userPhoto'>
                                <img className='w-100 mt-2' src={data.photoURL}></img>
                                <p className='userName text-white mt-3'>{item.username}</p>
                            </div>
                            <div>

                                {friend.includes(item.UserId + data.uid) || friend.includes(data.uid + item.UserId)
                                
                                ?
                                (<Button variant="success">Friend</Button>)
                                :
                                friendrequestList.includes(item.UserId + data.uid) || friendrequestList.includes(data.uid + item.UserId)
                                
                                ? 
                                <Button variant="success">pending</Button>
                                :
                                <Button onClick={()=>handleFriendRequest(item)} variant="success">Add Friend</Button>
                                
                                }
                               
                            </div>
                        </div>
                        
                    ))}
                </div>
            </Col>

            <Col  className='shadow-sm mb-4 py-4 md="4"'>
                <div className='total_user_section'>
                    
                    <h1 className='text-white mb-5'>Friends Request</h1>
                    {friendtList.map((item)=>(
                        <div className='userSection'>
                            <div className='userPhoto'>
                                <img className='w-100 mt-2' src={data.photoURL}></img>
                                <p className='userName text-white mt-3'>{item.sendername}</p>
                                
                            </div>
                            <div>
                                <Button onClick={()=>handleFriendRequestAccept(item)} variant="success">Accept</Button>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </Col>
            
            <Col  className='shadow-sm mb-4 py-4' md="4">
                <div className='total_user_section'>
                    
                    <h1 className='text-white mb-5'>Friends</h1>
                    {Confifriend.map((item)=>(
                        <div className='userSection'>
                            <div className='userPhoto'>
                                <img className='w-100 mt-2' src={data.photoURL}></img>
                                {data.uid == item.senderid ?
                                
                                <>
                                <p className='userName text-white mt-3'>{item.recivername}</p><br></br>
                                
                                </>
                                :
                                
                                <p className='userName text-white mt-3'>{item.sendername}</p>
                                }
                            </div>
                            <div>
                                <Button variant="success">Friend</Button>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </Col>
        </Row>

        <Row className='chatting_row'>
            <h1 className='text-center text-white chatting_heading'>Start conversion <span>with your's friends.</span></h1>
            <Col className='chatting_left' md='4'>
            <h5 className='chatting_left-friend'>Friends</h5>
            <div className='Chatting_userSection'>
            {Confifriend.map((item)=>(
                <div onClick={()=>handleActiveGroup(item)} className='userSection'>
                    <div className='userPhoto'>
                        <img className='w-100 mt-2' src={data.photoURL}></img>
                        {data.uid == item.senderid ?                      
                        
                            <p className='userName text-white mt-3'>{item.recivername}</p>
                                                        
                        :
                        
                            <p className='userName text-white mt-3'>{item.sendername}</p>

                        }
                    </div>   
                </div>
            ))}               
            </div>
            </Col>

            <Col className='chatting_right' md='8'>
                <div className='right_content'>
                    <div className='userAlign'>
                    
                        <div className='userPhoto'>
                            <img className='w-100 mt-2' src={data.photoURL}></img> 

                            <div className='activeDot'></div>
                        </div>
                        <div className='userNameChat'>
                        <span className=' text-white'>Name : {activeFriend.name}</span>
                        <p className='text-white onlineSection'>Online</p>

                        </div>
                        <p className='error_text'>{smserror}</p>
                    </div>

                </div>

                <div className='smsMainSection'>

                    {activeFriend.status == 'single' &&
                        smslist.map((item)=>(
                        item.whosendid == data.uid ?
                        item.whoreciveid == activeFriend.id &&
                        <Row>
                            <Col>

                                (<div className='reciUser'>
                                
                                    <div className=''>
                                        <p className='text-white reciveSms'>{item.msg}</p>
                                    </div>
                                                        
                                </div>)
                            </Col>
                        </Row>
                        :

                        <Row>
                            <Col>

                                <div className='sendUser'>
                                    <div className=''>
                                        <p className='text-white sendSms'>{item.msg}</p>
                                    </div>                       
                                </div>
                            </Col>
                        </Row>

                        
                        ))
                    
                    }
                                       
                </div>

                <div className='Chattinginputsecton'>
                    <Form.Control onChange={handleSms} type="text" placeholder="Write text here" />
                    <Button onClick={handleSmsSubmit} className='sendButton' >send</Button>
                </div>
            </Col>
        </Row>
    </Container>

  )
}

export default UserList