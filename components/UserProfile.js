import {
  Button,
Typography
} from '@mui/material';

export default function UserProfile({ user }) {
    return (

        <div className='Post-top-wrapper'>
          <div className="box-center">
         <Typography className='Personal-profile' variant='h5'>Personal Profile</Typography> 
        <div className='UserName-box'>
            <Typography className='UserName' variant='h6'>
            <img src={user.photoURL } className="card-img-center" />
              {/* <p><i>@{user.username}</i></p> */}
              <div className='profileDisplayName'><h2>{user.displayName}</h2></div>
        </Typography>
            <Button className='follow-btn' variant='contained'>Follow</Button> 
            <Typography className='StateSentence' variant='h8'>Hi there! Let's begin!</Typography>

            <div className='UserPoint-box' style={styles.container}>
              
                <div style={styles.UserPoint_container}> 
                <Typography className='Picture-following' variant='h5'>Picture</Typography>
                <Typography className='Number-Picture-following' variant='h8'>30</Typography> 
               
              </div>
              <div style={styles.UserPoint_container}> 
              <Typography className='Picture-following' variant='h5'>Point </Typography>
              <Typography className='Number-Picture-following' variant='h8'>600 </Typography> 
              </div>

              <div style={styles.UserPoint_container}> 
              <Typography className='Picture-following' variant='h5'>Followers </Typography>
              <Typography className='Number-Picture-following' variant='h8'> 250  </Typography> 
              </div>

              <div style={styles.UserPoint_container}> 
              <Typography className='Picture-following' variant='h5'>Following </Typography>
              <Typography className='Number-Picture-following' variant='h8'>280 </Typography> 
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