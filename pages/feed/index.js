import PostFeed from '../../components/PostFeed';
import Loader from '../../components/Loader';
import { firestore, fromMillis, postToJSON, postToJSON2 } from '../../lib/firebase';

import { useEffect, useContext } from 'react'; 
import { UserContext } from '/lib/context';
import { useState } from 'react';
import PostFeed2 from '../../components/PostFeed2';
import { TextInput } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import { ActionIcon, Space,Text, Center } from '@mantine/core';
import Link from 'next/link';
// Max post to query per page
const LIMIT = 5;

// export async function getServerSideProps(context) {
//   const postsQuery = firestore
//     .collectionGroup('posts')
//     .where('published', '==', true)
//     .orderBy('createdAt', 'desc')
//     .limit(LIMIT);

//   const posts = (await postsQuery.get()).docs.map(postToJSON);
//   console.log("ssr: ", posts);

//   return {
//     props: { posts }, // will be passed to the page component as props
//   };
// }

export default function Feed(props) {
  // const [posts, setPosts] = useState(props.posts);
  
  const { user, username } = useContext(UserContext)
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);
  const [followings, setFollowings] = useState([]);


  const [loadPosts, setloadPosts] = useState(false);
  const [render, setRender] = useState(false);

  const [postsToShow, setPostsToShow] = useState([]);

  
  const [counter, setCounter] = useState(0);

  const [search, setSearch] = useState('');

  useEffect(()=>{
    if(user && username){
      // const followingsQuery = firestore
      // .collection('users')
      // .doc(user.uid)
      // .collection('followings');

      // const thefollowings = (await followingsQuery.get()).docs.map(postToJSON2);
      var thefollowings = [];

      firestore.collection("users").doc(user.uid).collection("following").get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, " => ", doc.data());
              thefollowings.push(doc.data());
              //  settheCurrentUser(doc.data());
          });
          thefollowings = [...thefollowings,{uid: user.uid, username: username}];
          // setFollowings(thefollowings);
          // setloadPosts(true);
          var thePosts = [];
          for(let i = 0; i< thefollowings.length; i++){
            firestore.collectionGroup("posts").where('published', '==', true).where('uid', '==', thefollowings[i].uid)
            .orderBy('createdAt', 'desc').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("loops", i , thefollowings[i].uid, " => ", doc.data());
                    // followingPosts.push(doc.data());
                    // //  settheCurrentUser(doc.data());
                    // console.log('thePosts in fetch: ', followingPosts);
                    thePosts.push(doc.data());
                    // var theData = doc.data();
                    // setPosts(posts.concat(theData));
                });
                // if(thePosts != []){
                setPosts(thePosts);
                //   console.log('thePosts now: ', thePosts);
                // }
            }
            
            );
          }
          // setPosts(thePosts);
          setRender(true);
      });
      
      // thefollowings = [...thefollowings,{uid: user.uid, username: username}];
      // console.log("theFollowings: ", thefollowings);
      // console.log("theFollowingsLength: ", thefollowings.length);
      // console.log("[0]: ", thefollowings[0]);
      // console.log("[1]: ", thefollowings[1]);
      // setFollowings(thefollowings);
    }
  },[user, username])

  useEffect(()=>{
    console.log("current posts: ", posts, ", counter:" ,counter);
    setCounter(counter+1);
    setPostsToShow(posts);
  },[posts])

  // useEffect(()=>{
  //   if(loadPosts){
  //     var thePosts = [];
  //     // console.log('theFollowings is here: ', followings);
  //     for (let i = 0; i < followings.length; i++) {
  //       var theUID = followings[i].uid;
  //       // console.log('theUID: ', theUID);
  //       // console.log('followings in loop: ', followings);
  //       // console.log('followings length b4 loop: ', followings.length);
  //       // const postsQuery = firestore
  //       // .collectionGroup('posts')
  //       // .where('published', '==', true)
  //       // .where('uid', '==', theUID)
  //       // .orderBy('createdAt', 'desc')
    
  //       // const followingPosts = (await postsQuery.get()).docs.map(postToJSON);
  //       var followingPosts = [];
  //       firestore.collectionGroup("posts").where('published', '==', true).where('uid', '==', theUID).orderBy('createdAt', 'desc').get()
  //       .then((querySnapshot) => {
  //           querySnapshot.forEach((doc) => {
  //               // doc.data() is never undefined for query doc snapshots
  //               console.log("loops", i , theUID, " => ", doc.data());
  //               // followingPosts.push(doc.data());
  //               // //  settheCurrentUser(doc.data());
  //               // console.log('thePosts in fetch: ', followingPosts);
  //               thePosts.push(doc.data());
                
  //           });
  //           // setPosts(thePosts);
  //           // console.log('thePosts now: ', thePosts);
  //       });

  //       // thePosts.push(...followingPosts);
  //       // console.log('thePosts2: ', thePosts);
  //       // setPosts(thePosts);
  //     }

  //     setPosts(thePosts);
  //     console.log('thePosts now: ', thePosts);

  //     // console.log('thePosts33: ', thePosts);
  //     // setPosts(thePosts);
  //     // setPosts(thePosts);
  //     // setloadPosts(false);
  //   }
  // },[loadPosts])



  // useEffect(()=>{
  //     if(posts != null){
  //       console.log("posts finally: ", posts);
  //       setPostsToShow(posts);
  //       setRender(true);
  //     }
  // },[posts])

  // useEffect(()=>{
  //   console.log('postsToShow: ', postsToShow);
  // }, [postsToShow])


  // const getMorePosts = async () => {
  //   setLoading(true);
  //   const last = posts[posts.length - 1];

  //   const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

  //   const query = firestore
  //     .collectionGroup('posts')
  //     .where('published', '==', true)
  //     .orderBy('createdAt', 'desc')
  //     .startAfter(cursor)
  //     .limit(LIMIT);

  //   const newPosts = (await query.get()).docs.map((doc) => doc.data());

  //   console.log('new posts: ', newPosts);
  //   setPosts(posts.concat(newPosts));
  //   setLoading(false);

  //   if (newPosts.length < LIMIT) {
  //     setPostsEnd(true);
  //   }
  // };

  return  (
    <>
    

    <div className='basket-top'>
    <div className='basket-card-container'>
      <Space h="sm" />
      <Center>
        <Text weight={600} size='xl' className='white-title'>Feeds</Text>
      </Center>
      <Space h="xs" />
      <div className='feed-search-area'>
      <TextInput
            placeholder="Search for user account"
            radius="xl"
            size='xs'
            value={search} onChange={(event) => setSearch(event.currentTarget.value)}
            className='feed-search'
          />
      <Link href={`/${search}/`} >
        <ActionIcon size="lg" variant="transparent">
          <Search color={'#ffffff'}/>
        </ActionIcon>
      </Link>
      </div>
      <Space h={25}/>
    </div>
    
    </div>
    <Space h={15} />
        <main>
          {/* <div>{posts.length}</div> */}
          <PostFeed className="feedcard"  posts={posts} />

          {/* {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
          
          <Loader show={loading} />

          {postsEnd && 'You have reached the end!'}

          <div className='newsSpace'></div> */}
        </main>
    </>
  )
}
