import Link from 'next/link';

// import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import {
  Typography
} from '@mui/material';

import { Card, Image, Text, Space } from '@mantine/core';


export default function NewsFeed({ posts, admin }) {
  
  return (
    <div className='profileItemDiv'>
    {(posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null)}
    </div>
  );
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
  //    <div className="newsCard">

  //       <div className='newsImage'>
  //       <img src = {post.imageUrl} />
  //       </div>
       
  //  <Link href={`/${post.username}/${post.slug}`}>
       
  //       <h2>
  //         <a>{post.title}</a>
  //       </h2>
  //     </Link>

  //     <footer>
  //       <span>
  //         {wordCount} words. {minutesToRead} min read
  //       </span>
  //       <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
  //     </footer>

  //     {/* If admin view, show extra controls for user */}
  //   {admin && (
  //       <>
  //         <Link href={`/admin/${post.slug}`}>
  //           <h3>
  //             <button className="btn-blue">Edit</button>
  //           </h3>
  //         </Link>

  //         {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
  //       </>
  //     )} 
  //   </div>
  <Link href={`/${post.username}/${post.slug}`}>
    <Card
        className='newsCard'
        shadow="sm"
        p="xl"
        component="a"
        // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        // target="_blank"
        radius={15}
      >
        <Card.Section>
          <Image src={post.imageUrl} height={160} alt="No way!" />
        </Card.Section>

        <Text weight={500} size="lg">
          {post.title}
        </Text>

        <Text weight={500} size="xs">
          <span>{wordCount} words. {minutesToRead} min read</span>
        </Text>
        <Space h="xs" />
        <Text weight={500} size="xs">
        <div className="text-right">💚 {post.heartCount || 0} Hearts</div>
        </Text>
      </Card>
    </Link>
  );
}