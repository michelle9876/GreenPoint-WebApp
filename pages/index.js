// import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON3,auth } from '../lib/firebase';

import { useState } from 'react'; 
import NewsFeed from '../components/NewsFeed';
import { TextInput, Group } from '@mantine/core';
import { Text } from '@mantine/core';
import { Space } from '@mantine/core';
import { Center } from '@mantine/core';
import { useEffect, useContext } from 'react'; 
import { UserContext } from '/lib/context';
import React from 'react';
import Logo from '../public/images/logo.png';

import { Slide } from 'react-slideshow-image';

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('username','==','news')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON3);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const { user, username } = useContext(UserContext)

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .where('username','==','news')
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };



  return (
    <>
    <div className='news-top'>
    {/* console.log(Logo);
    <img src={Logo}  alt='Logo'/> */}

    
{/* <img src='/images/logo.png' className='logo'/> */}
    <Space h="lg" />
    {/* <div className='home-page-banner-row'> */}
      {/* <Group position="center" grow className='home-page-banner-group'> */}
        {/* <div> */}
        
        {/* </div> */}

        <div className='home-page-banner-content'>
        <img src='/images/logo.png' className='logo'/>
          <Center>
            <Text weight={600} size='xl' className='white-title'>News</Text>
          </Center>
          <div className='basket-bottom'>
            <div className='home-search-area'>
            <Space h="sm" />
              <Center>
              {username != null && <Text size="xl" weight={500} className='white-title'>Welcome! {username}</Text>}
              {username == null && <Text size="xl" weight={500} className='white-title'>Welcome!</Text>}
              </Center>
            </div>
          </div>
          </div>
          
        {/* </Group> */}
      {/* </div> */}
      <Space h={20}/>
      </div>
      <main>
        
      <Space h={20}/>

        < NewsFeed posts={posts} />


        {/* <div className='newsBtnAlign'> */}
          <Center>
            {!loading && !postsEnd && <button onClick={getMorePosts} className="load-button">Load more</button>}    
            <Loader show={loading} />
            {postsEnd && 'No more news'}
          </Center>
        {/* </div> */}
        

        {/* <div className='newsSpace'></div> */}
      </main>
    </>

  );
}
