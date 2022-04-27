import { auth, getUserWithUsername, postToJSON } from '/lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';

import { useEffect, useContext, useState } from 'react'; 

import { firestore, fromMillis } from '/lib/firebase';
import { UserContext } from '/lib/context';
import { Center, Space } from '@mantine/core';
import Loader from '/components/Loader';
import NewsProfile from '../../components/NewsProfile';
import NewsFeed from '../../components/NewsFeed';

export async function getServerSideProps({ query }) {
  
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;
  
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      // .limit(6);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  
  const [theposts, setPosts] = useState(posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  const { theuser, username } = useContext(UserContext)

  const getMorePosts = async () => {
    setLoading(true);
    const last = theposts[theposts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    if(username){
      const query = firestore
      .collectionGroup('posts')
      .where('username','==', username)
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(6);

      const newPosts = (await query.get()).docs.map((doc) => doc.data());
      console.log("newPosts: ", newPosts);
      setPosts(theposts.concat(newPosts));

      if (newPosts.length < 6) {
        setPostsEnd(true);
      }
    }

    setLoading(false);

    
  };

  return user.uid != "news" ? (

    <div>
      {/* <div>{user.uid}</div> */}
      <UserProfile thisuser={user} />
      <PostFeed posts={theposts} />

      {/* <Center>
            {!loading && !postsEnd && <button onClick={getMorePosts} className="load-button">Load more</button>}    
            <Loader show={loading} />
            {postsEnd && 'No more posts'}
      </Center> */}
      {/* <div className='newsSpace'></div> */}
    </div>

    
  ) : (
    <div>
      {/* <div>{user.uid}</div> */}
      <NewsProfile thisuser={user} />
      <Space h={20}/>
      <NewsFeed posts={theposts} />

      {/* <Center>
            {!loading && !postsEnd && <button onClick={getMorePosts} className="load-button">Load more</button>}    
            <Loader show={loading} />
            {postsEnd && 'No more posts'}
      </Center> */}
      {/* <div className='newsSpace'></div> */}
    </div>
  );
}