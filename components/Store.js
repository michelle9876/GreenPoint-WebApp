import Link from 'next/link';

import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import NextLink from 'next/link';
import Button from '@mui/material/Button';

export default function Store({ items, admin }) {
  return items ? items.map((item) => <StoreItem item={item}/>) : null;
}

function StoreItem({ item }) {
  // Naive method to calc word count and read time
  //const wordCount = post?.content.trim().split(/\s+/g).length;
  //const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
<div>
    <Card>
    <NextLink href={`/store/${item.slug}`} passHref>
    <CardActionArea>
      <CardMedia 
      component="img" 
      image={item.image}
      title={item.name}>
      </CardMedia>
      <CardContent>
        <Typography>
          {item.name}
        </Typography>
      </CardContent>
    </CardActionArea>
    </NextLink>
    <CardActions>
      <Typography>£{item.price}</Typography>
      <Button size="small" color="primary">Add to cart</Button>
    </CardActions>
  </Card>
  </div>

  );
}