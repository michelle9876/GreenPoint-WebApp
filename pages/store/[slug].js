import React from "react";
import Data from "../../components/Data";
import {useRouter} from 'next/router';
import { ClassNames } from "@emotion/react";
import {Grid, Link, List, ListItem, Typography, Card, Button} from '@mui/material';
import NextLink from 'next/link';
import { firestore, fromMillis, postToJSON, auth } from '/lib/firebase';
import { useState, useEffect } from 'react'; 



export default function StoreProductScreen(){
    const router = useRouter();
    const {slug} = router.query;
    const [theProduct, setTheProduct] = useState()

    // const product = Data.products.find(a => a.slug === slug);
    // if(!product){
    //     return <div>Product Not Found!</div>;
    // }
    useEffect(() => {
        if(slug){
            firestore.collection("shop").where("slug", "==", slug)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    setTheProduct(doc.data());
                });
            });
        }
        
    }, [slug])

    return theProduct? (
    <div title={theProduct.name}>
            <NextLink href="/store" passHref>
                <Link>Back to products</Link>
            </NextLink>
    <div>
       <Grid container spacing={1}>
           <Grid item md={6} xs={12}>
                <img src={theProduct.image} 
                alt={theProduct.name} 
                width={640} height={640} 
                layout="responsive">
                </img>
           </Grid>
           <Grid item md={3} xs={12}>
            <List>
            <h1>{theProduct.name}</h1>

                <ListItem> <Typography>Category: {theProduct.category}</Typography></ListItem>
                {/* <ListItem> <Typography>Option: {theProduct.option}</Typography></ListItem> */}
                {/* <ListItem><Typography> Expiration: {theProduct.expiration}</Typography></ListItem> */}
                <ListItem><Typography>Description: {theProduct.description}</Typography></ListItem>
            </List>
           </Grid>
           <Grid item md={3} ex={12}>
               <Card>
                  <List>
                      <ListItem>
                          <Grid container>
                              <Grid item xs={8}><Typography>Price</Typography></Grid>
                              <Grid item xs={6}><Typography>${theProduct.price}</Typography></Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                          <Grid container>
                              <Grid item xs={8}><Typography>Quantity</Typography></Grid>
                              <Grid item xs={6}><Typography>${theProduct.quantity}</Typography></Grid>
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
    ) : (
        <></>
    );
}