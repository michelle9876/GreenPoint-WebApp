import {
  Button,
Typography
} from '@mui/material';
import { auth, firestore, getUserWithUsername } from '../lib/firebase';



export async function getServerSideProps({ }) {

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


export default function ShopProfile({ theUser }) {

    return (
<div className='Post-top-wrapper'>
          <div className="box-center">
         <Typography className='Personal-profile' variant='h5'>Personal Profile</Typography> 
        <div className='UserName-box'>
            <Typography className='UserName' variant='h6'>
            <img src={theUser?.photoURL } className="card-img-center" />
              <div className='profileDisplayName'><h2>{theUser?.displayName}</h2></div>
            </Typography>
            <Button className='follow-btn' variant='contained'>Follow</Button> 
            <Typography className='StateSentence' variant='h8'>Hi there! Let's begin!</Typography>

            <div className='UserPoint-box' style={styles.container}>
              
                <div style={styles.UserPoint_container}> 
                <Typography className='Number-Picture-following' variant='h8'>Basket</Typography> 
               
              </div>
              <div style={styles.UserPoint_container}> 
              <Typography className='Number-Picture-following' variant='h8'>DonePurchase </Typography> 
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