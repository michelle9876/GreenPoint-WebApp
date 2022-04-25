import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Image, Space } from '@mantine/core';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return post.username != "news" ? (
    <div className="card">
      <div className='post-content-padding'>
        <h2>{post?.title}</h2>
      </div>
      
      <Image
        radius="md"
        src={post.imageURL}
      />
      <div className='post-content-padding'>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
      <span className="text-sm">
        Posted by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toString()}
      </span>
      </div>
    </div>
  ) : (
    <div className="card">
        <div className='post-content-padding'>
        <h2>{post?.title}</h2>
      </div>
    <Image
        radius="md"
        src={post.imageUrl}
      />
      <div className='post-content-padding'>
    <span className="text-sm">
      Posted by{' '}
      <Link href={`/${post.username}/`}>
        <a className="text-info">@{post.username}</a>
      </Link>{' '}
      on {createdAt.toString()}
    </span>
    
    <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  </div>
  );
}