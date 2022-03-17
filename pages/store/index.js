import { getUserWithUsername, postToJSON, auth } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import ShopProfile from '../../components/ShopProfile';
import { UserContext } from '../../lib/context';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useEffect, useState, useCallback, useContext } from 'react';
import Data from '../../components/Data';
import { Button } from '@mui/material';
import NextLink from 'next/link';
import Store from '../../components/Store';
import { firestore, fromMillis } from '../../lib/firebase';
// export async function getServerSideProps({ }) {
//   //const { username } = 'michelle';


//   const userDoc = await getUserWithUsername(username);

//   // JSON serializable data
//   let user = null;
//   let posts = null;
  
//   if (!userDoc) {
//     return {
//       notFound: true,
//     };
//   }

//   if (userDoc) {
//     user = userDoc.data();
//   }

//   return {
//     props: {user}, // will be passed to the page component as props
//   };
// }  

export async function getServerSideProps(context) {
  const itemsquery = firestore
    .collection('shop');
    // .where('username','==','news')
    // .where('published', '==', true)
    // .orderBy('createdAt', 'desc')

  const items = (await itemsquery.get()).docs.map(postToJSON);

  return {
    props: { items }, // will be passed to the page component as props
  };
}


export default function ShopProfilePage(props) {
  //const { user, username } = useContext(UserContext);

  const { user, username } = useContext(UserContext)

  return (
    
    <div>
      <ShopProfile theUser={user} />
      <Store items={props.items}/>
      {/* <PostFeed posts={posts} /> */}
      {/* <Grid container spacing={3}>
        {Data.products.map((product)=> (
          <Grid item md={4} key={product.name}>
          <Card>
            <NextLink href={`/store/${product.slug}`} passHref>
            <CardActionArea>
              <CardMedia 
              component="img" 
              image={product.image}
              title={product.name}>
              </CardMedia>
              <CardContent>
                <Typography>
                  {product.name}
                </Typography>
              </CardContent>
            </CardActionArea>
            </NextLink>
            <CardActions>
              <Typography>£{product.price}</Typography>
              <Button size="small" color="primary">Add to cart</Button>
            </CardActions>
          </Card>
          </Grid>
        ))}
      </Grid> */}
      <div className='newsSpace'></div>
    </div>

    
  );
}