// import {Button,Typography} from '@mui/material';
import { Text,Space,Button, Menu, Group, Burger, Center } from '@mantine/core';
import { Settings, Search, Photo, MessageCircle, Trash, ArrowsLeftRight, User } from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';

import Link from 'next/link';

import { useEffect, useContext, useState } from 'react'; 
import { firestore, fromMillis, postToJSON, auth } from '/lib/firebase';

import { UserContext } from '/lib/context';
import FollowButton from './FollowButton';
export default function UserProfile({ thisuser }) {

  const { user, username } = useContext(UserContext)

  const [theCurrentUser, settheCurrentUser] = useState()
  const [thefollowings, setFollowings] = useState([])
  const [followingsAmount, setfollowingsAmount] = useState(0)

  const [thefollowers, setFollowers] = useState([])
  const [followersAmount, setfollowersAmount] = useState(0)

  const [ready, setReady] = useState(false);

  const [showFollowBTN, setShowFollowBTN] = useState(false);

  const [opened, setOpened] = useState(false);
  const [menuopened, handlers] = useDisclosure(false);

  useEffect(() => {
    if(thisuser){
        var followings = [];
        console.log("user: ", thisuser);
        firestore.collection("users").doc(thisuser.uid).collection("following").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                followings.push(doc.data());
                // //  settheCurrentUser(doc.data());
                setFollowings(followings);
                setfollowingsAmount(followings.length);
                // console.log("final ",followings.length);
            });
        });
        // setFollowings(followings);
        // setfollowingsAmount(followings.length);
        // console.log("final ",followings.length);
        setReady(true)
    }


    
}, [thisuser])

useEffect(() => {
  if(thisuser){
      var followers = [];
      console.log("user: ", thisuser);
      firestore.collection("users").doc(thisuser.uid).collection("followers").get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " 2=> ", doc.data());
              followers.push(doc.data());
              // //  settheCurrentUser(doc.data());
              setFollowers(followers);
              setfollowersAmount(followers.length);
              // console.log("final ",followings.length);
          });
      });
      // setFollowings(followings);
      // setfollowingsAmount(followings.length);
      // console.log("final ",followings.length);
      setReady(true)
  }
}, [thisuser])

useEffect(() => {
  if(user){
    if(user?.uid !== thisuser.uid){
      //not the same person, can check if followed or not 
      setShowFollowBTN(true);
    }
  }
},[user])


// useEffect(() => {
//   if(user){
//       var posts = [];
//       console.log("user: ", user);
//       firestore.collection("users").doc(user.uid).collection("posts").get()
//       .then((querySnapshot) => {
//           querySnapshot.forEach((doc) => {
//               // doc.data() is never undefined for query doc snapshots
//               console.log("published: ", doc.data().published)
//               if(doc.data().published == true){
//                 posts.push(doc.data());
//               }
//               // //  settheCurrentUser(doc.data());
//               setfollowersAmount(posts.length);
//               // console.log("final ",followings.length);
//           });
//       });
//       // setFollowings(followings);
//       // setfollowingsAmount(followings.length);
//       // console.log("final ",followings.length);
//       setReady(true)
//   }
// }, [user])



    return (

        <div className='Post-top-wrapper'>
          <div className="box-center2">
          <Space h="lg" />

          {

            username == thisuser.username ? 
          //   <Group position='center'>
          //   <Text size="xl" weight={600}>Personal Profile</Text>
            // <Menu control={<Burger
            //     opened={opened}
            //     onClick={() => setOpened((o) => !o)}
            //   />}>
            //   <Menu.Label>Account</Menu.Label>
            //   <Link href='/enter'>
            //   <Menu.Item icon={<User size={14} />}>Sign out</Menu.Item>
            //   </Link>
            // </Menu>
          // </Group> 
          <div className='profile-top-bar'>
            <Menu control={<Burger
                color="#34CC98"
                opened={opened}
                onClick={() => setOpened((o) => !o)}
              />} className='profile-top-bar-menu'>
              <Menu.Label>Account</Menu.Label>
              <Link href='/enter'>
              <Menu.Item icon={<User size={14} />}>Sign out</Menu.Item>
              </Link>
            </Menu>
            <Center>
            <Text size="xl" weight={600}>Personal Profile</Text>
            </Center>
          </div>
          : 
          <div className='profile-top-bar'>
            <Center>
              <Text size="xl" weight={600}>Personal Profile</Text>
            </Center>
              </div>

          }

          
          {/* <div>{username} your uid: {user?.uid} this uid: {thisuser?.uid}</div> */}
          <Space h="lg" />
        <div className='UserName-box'>
            <Space h={10}/>
            <div className='UserName'>
            <img src={thisuser.photoURL } className="card-img-center" />
              {/* <p><i>@{user.username}</i></p> */}
                <div className='profileDisplayName'>
                  <div className='ProfileName'>{thisuser.displayName}</div>

                  {
                  
                    // showFollowBTN===true ? <Button className='follow-button'>Follow</Button> : <></>
                    showFollowBTN===true && username != thisuser.username ? <FollowButton yourID={user.uid} yourUsername={username} theirID={thisuser.uid}/> : <></>
                  
                }
                  {/* <div className='StateSentence' > 1</div> */}
              </div>
              <div>
              
              </div>
            </div>
            {/* <Button className='follow-btn' variant='contained'>Follow</Button>  */}

            <div className='UserPoint-box' style={styles.container}>
              
                <div style={styles.UserPoint_container}> 
                <div className='Picture-following' >Posts</div>
                <div className='Number-Picture-following' >{thisuser.posts}</div> 
               
              </div>
              <div style={styles.UserPoint_container}> 
              <div className='Picture-following'>Points </div>
              <div className='Number-Picture-following' > {thisuser.points} </div> 
              </div>

              <div style={styles.UserPoint_container}> 
              <div className='Picture-following'>Followers </div>
              <div className='Number-Picture-following' > {followersAmount}  </div> 
              </div>

              <div style={styles.UserPoint_container}> 
              <div className='Picture-following'>Following </div>
              <div className='Number-Picture-following' > {followingsAmount} </div> 
              </div>
            </div>
            
        </div>
        <div className='profilePageSpacer'></div>
       </div>
        {/* <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p>
          <i>@{user.username}</i>
        </p> */}

       
      </div>
    );
  }

  const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    postContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    UserPoint_container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 3
    }
  }