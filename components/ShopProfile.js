import {Button,Typography} from '@mui/material';
import { auth, firestore, getUserWithUsername } from '/lib/firebase';
import AuthCheck from '/components/AuthCheck';
import { useState, useEffect } from 'react'; 
import { Text,Space, Group, Center } from '@mantine/core';
import Link from 'next/link';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export async function getServerSideProps({}) {

  let user = null;
  let posts = null;

  const uid = null
  uid = auth.currentUser.uid;

  if(uid != null){
    const usernameRef = firestore.collection('usernames');
    const query = usernameRef.where('uid', '==', uid).limit(1);
    const {username} = (await query.get()).docs[0];
    const userDoc = await getUserWithUsername(username);
  }

  if(!userDoc){
    return {
      notFound: true,
    };
  }

  if(userDoc){
    user=userDoc.data();
    const postsQuery = userDoc.ref
    .collection('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { }, // will be passed to the page component as props
  };
}


export default function ShopProfile({ theUser, theUsername }) {

    const [theCurrentUser, settheCurrentUser] = useState(theUsername)

    useEffect(() => {
      if(theUsername){
          firestore.collection("users").where("username", "==", theUsername)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  // console.log(doc.id, " => ", doc.data());
                  settheCurrentUser(doc.data());
              });
          });
      }
      
  }, [theUsername])

    
    return (
        <div className='Post-top-wrapper'>
          <div className="box-center">
            <Space h="lg" />
            <Text size="xl" weight={600}>Shop</Text>
            <Space h="lg" />
          <div className='UserName-box'>
          <AuthCheck
                fallback={
                  <>
                  <Space h={10}/>
                  <Center>
                  <Link href="/enter">
                  <button className="btn-blue">Log in</button>
                </Link>
                </Center>
                <Space h={10}/>
                </>
                }
              >
            <div className='UserName'>
    
                <img src={theUser?.photoURL } className="card-img-center" />
                <div className='profileDisplayName'>
                  <div className='ProfileName'>{theUser?.displayName}</div>
                  <div className='StateSentence' >points: {theCurrentUser?.points}</div>
                </div>
                
              
            </div>
            </AuthCheck>
            {/* <Button className='follow-btn' variant='contained'>Follow</Button>  */}
            {/* <div className='StateSentence' variant='h8'>Hi there! Let's begin!</div> */}

            <div className='UserPoint-box' style={styles.container}>
              
                {/* <div style={styles.UserPoint_container}>  */}
                {/* <Typography className='Number-Picture-following' variant='h8'>Basket</Typography>  */}
                {/* <Link href={`/basket/`} ><button className='basket-button'>Basket</button></Link> */}

                <AuthCheck
                  fallback={
                    <>
                      <Space h={30}/>
                    </>
                  }
                >
                                  <Group position="center" grow>
                  <Link href={`/basket/`} ><button className='basket-button'>Basket</button></Link>
                  <Link href={`/purchased/`} ><button className='basket-button'>Purchased items</button></Link>
                </Group>
                </AuthCheck>

               
              {/* </div> */}
              {/* <div style={styles.UserPoint_container}>  */}
              {/* <div className='Number-Picture-following' variant='h8'>Done Purchase </div>  */}
                {/* <Link href={`/basket/`} ><button className='basket-button'>Purchased items</button></Link> */}
              {/* </div> */}
            </div>
        </div>
        <div className='profilePageSpacer'></div>
       </div>
        {/* <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p>
          <i>@{user.username}</i>
        </p> */}
      </div>
      
    ) 
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