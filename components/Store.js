  import Link from 'next/link';

import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import NextLink from 'next/link';
import Button from '@mui/material/Button';
import { NumberInput } from '@mantine/core';
import { useState } from 'react'; 
import { firestore, auth, increment } from '/lib/firebase';

import { useEffect, useContext } from 'react'; 
import { UserContext } from '/lib/context';
import toast from 'react-hot-toast';
import { Basket, ShoppingCart } from 'tabler-icons-react';

export default function Store({items, admin, theUser}) {

  const [filter, setFilter] = useState('all');
  const [filteredItems, setfilteredItems] = useState([]);


  useEffect(()=>{
    if(filter == "all"){
      setfilteredItems(items);
    }
    if(filter == "product"){
      var filtered = items.filter(item=>item.category.includes("Product"));
      console.log("Product F: ", filtered);
      setfilteredItems(filtered);
    }
    if(filter == "coupon"){
      var filtered = items.filter(item=>item.category.includes("Coupon"));
      console.log("Coupon F: ", filtered);
      setfilteredItems(filtered);
    }
  },[filter])


  const allSelected = () => {
    setFilter("all");
    console.log("all");
  }

  const productSelected = () => {
    setFilter("product");
  }

  const couponSelected = () => {
    setFilter("coupon");
  }

  return (
    <div className="box-center">
    <div className='profilePageSpacer'></div>
       <div className="point-store-bar" style={styles.container}>
          <div style={styles.UserPoint_container}> 
          <button className='product-button' onClick={allSelected}>All</button>
          </div>
          <div style={styles.UserPoint_container}> 
          <button className='product-button' onClick={productSelected}>Product</button>
          </div>
          <div style={styles.UserPoint_container}> 
          <button className='product-button' onClick={couponSelected}>Coupon</button>
          </div>
       </div>  
       <div className='shop-items-container'>
       {/* {items ? items.map((item) => <StoreItem item={item} theUser={theUser} key={item.image}/>) : null} */}
       {filteredItems ? filteredItems.map((item) => <StoreItem item={item} theUser={theUser} key={item.UUID}/>) : null}
       </div>
    </div>

    
  )
}

function StoreItem({ item, theUser }) {
  // Naive method to calc word count and read time
  //const wordCount = post?.content.trim().split(/\s+/g).length;
  //const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  const [value, setValue] = useState(0);

  const { user, username } = useContext(UserContext)

  



  const addToBasket = async () => {
    if(theUser){
      toast.success('Added ' + value + ' ' + item.name + ' to the cart');
      var DocRef = firestore.collection("users").doc(theUser.uid).collection("basket").doc(item.slug);
      // const uid = auth.currentUser.uid;
      const batch = firestore.batch();
      // batch.update(postRef, { heartCount: increment(1) });
      batch.set(DocRef, { price: item.price, name: item.name,quantity : value, slug: item.slug, total: item.price*value, image: item.image, description: item.description, user: theUser.uid });
      await batch.commit();
    }
  };  



  

  return (
  <div>
    <Card className='shop-item-card'>
    {/* <NextLink href={`/store/${item.slug}`} passHref> */}
    {/* <CardActionArea> */}
    <div className="flex-container">
      {/* <CardMedia 
      component="img" 
      image={item.image}
      height="150"
      width="150"
      title={item.name}>
      </CardMedia> */}
      <div className='flex1'>
        <Link href={`/store/${item.slug}`} >
          <img src={item.image} width="150" height="150" className='shop-item-image'></img> 
        </Link>
      </div>
      
      {/* <CardContent>
        <Typography>
          {item.name}
        </Typography>
      </CardContent> */}
    {/* </CardActionArea> */}
      <div className='flex8'>
        <div className='shop-item-content'>
          <div className='shop-item-topic'>{item.name}</div>
          <div className='shop-item-text'>Points: {item.price}</div>
          {/* <input type="number" id="points" name="points"> */}
          {/* <div className='shop-item-text'>Quantity: {item.quantity}</div> */}
          <div className='shop-item-text'>Quantity: <NumberInput min={0} size="xs" value={value} onChange={(val) => setValue(val)} /> </div> 
          {/* <div className='shop-item-text'>Validate: {item.validate}</div> */}
          <div className='shop-item-text'>Total: {item.price * value}</div>
        </div>
      </div>

      <div className='flex2'>
        {/* <div className='shop-button-column'>
          <button className='shop-button'><Link href={`/store/${item.slug}`} >Information</Link></button>
        </div> */}
        <div className='shop-button-column'>
          <button className='shop-button' onClick={addToBasket} disabled={value == 0}><ShoppingCart
          size={20}
          strokeWidth={2}
          color={'#FFFFFF'}
    /></button>
        </div>
      </div>
    </div>
    {/* </NextLink> */}

    </Card>
  </div>
  );
}

const styles = {
  container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly'
  },
  postContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  UserPoint_container: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 0
  }
}