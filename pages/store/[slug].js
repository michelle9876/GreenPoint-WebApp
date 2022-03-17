import React from "react";
import Data from "../../components/Data";
import {useRouter} from 'next/router';
import { ClassNames } from "@emotion/react";
import {Grid, Link, List, ListItem, Typography, Card, Button} from '@mui/material';
import NextLink from 'next/link';

export default function StoreProductScreen(){
    const router = useRouter();
    const {slug} = router.query;
    const product = Data.products.find(a => a.slug === slug);
    if(!product){
        return <div>Product Not Found!</div>;
    }
    return (
    <div title={product.name}>
            <NextLink href="/store" passHref>
                <Link>Back to products</Link>
            </NextLink>
    <div>
       <Grid container spacing={1}>
           <Grid item md={6} xs={12}>
                <img src={product.image} 
                alt={product.name} 
                width={640} height={640} 
                layout="responsive">
                </img>
           </Grid>
           <Grid item md={3} xs={12}>
            <List>
            <h1>{product.name}</h1>

                <ListItem> <Typography>Category: {product.category}</Typography></ListItem>
                <ListItem> <Typography>Option: {product.option}</Typography></ListItem>
                <ListItem><Typography> Expiration: {product.expiration}</Typography></ListItem>
                <ListItem><Typography>Description: {product.description}</Typography></ListItem>
            </List>
           </Grid>
           <Grid item md={3} ex={12}>
               <Card>
                  <List>
                      <ListItem>
                          <Grid container>
                              <Grid item xs={8}><Typography>Price</Typography></Grid>
                              <Grid item xs={6}><Typography>${product.price}</Typography></Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                          <Grid container>
                              <Grid item xs={8}><Typography>Quantity</Typography></Grid>
                              <Grid item xs={6}><Typography>${product.quantity}</Typography></Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                          <Button fullWidth variant="contained" color="primary">Add to cart</Button>
                      </ListItem>
                  </List>
               </Card>

           </Grid>
       </Grid>
        
    </div>
    </div>
    );
}