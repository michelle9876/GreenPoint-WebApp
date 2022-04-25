import Link from 'next/link';
import { Card, Image, Text, Group, Space } from '@mantine/core';


export default function PostFeed({ posts, admin }) {
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
  console.log("ThePost: ", post);
  return (
  <Link href={`/${post.username}/${post.slug}`}>
    <div className='card-height'>
    <Card
      shadow="sm"
      p="xl"
      component="a"
      target="_blank"
      radius={15}
    >
      <Card.Section>
        <Image src={post.imageURL} height={220} />
      </Card.Section>

      <Text weight={500} size="lg">
        {post.title}
      </Text>

      <Text size="sm">
        <div>
          <div> category: #{post.category} </div>
          <Space h={10}/>
          <Group position="apart">
            <div className='post-name-container'><div>By</div> <Space w={5}/> <Text weight={500} size="sm">{post.username}</Text></div>
            <div> 💚 {post.heartCount || 0} Hearts </div>
          </Group>
          {/* <div className='text-right'> 💗 {post.heartCount || 0} Hearts </div> */}
        </div>
      </Text>
    </Card>
    </div>
    </Link>
  );
}