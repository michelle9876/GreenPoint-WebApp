// import {, Typography} from '@mui/material';
import { auth, firestore, getUserWithUsername, increment, serverTimestamp } from '/lib/firebase';

import AuthCheck from '/components/AuthCheck';

import { fromMillis, postToJSON } from '/lib/firebase';
import { useState, useEffect, useContext } from 'react'; 
import { UserContext } from '/lib/context';
// import {Grid, List, ListItem, Card} from '@mui/material';
import { Card, Image, Text, Divider, Group, Space, Button, Center, Modal } from '@mantine/core';
import toast from 'react-hot-toast';
import { Notification } from '@mantine/core';
import { Check, Circle, CircleCheck } from 'tabler-icons-react';



export default function BasketPage({ props}) {

    const { user, username } = useContext(UserContext)

    const [theCurrentUser, settheCurrentUser] = useState()
    const [items, setitems] = useState([])
    const [ready, setReady] = useState(false);

    const [filter, setFilter] = useState('all');
    const [filteredItems, setfilteredItems] = useState([]);

    const [thePoints, setThePoints] = useState(0);
    const [orderTotal , setOrderTotal] = useState(0);


    const [Modalopened, setModalOpened] = useState(false);


    useEffect(() => {
      if(user && username){
          var itemInBaskets = [];
          console.log("user: ", user.uid);
          firestore.collection("users").doc(user.uid).collection("basket").get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc.id, " => ", doc.data());
                  itemInBaskets.push(doc.data());
                  //  settheCurrentUser(doc.data());
              });
              setitems(itemInBaskets);
              setReady(true)
          });
                    
          let unsubscribe;

          if (user){
            const ref = firestore.collection('users').doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) =>{
              setThePoints(doc.data()?.points);
            });
          } else {
            setThePoints(0);
          }
          return unsubscribe;
      }
  }, [user, username])

    useEffect(()=>{
        console.log("items: ", items);
        let theTotal = 0;
        for (let i = 0; i < items.length; i++) {
          theTotal += items[i].total;
        }
        setOrderTotal(theTotal);
    },[items])


    useEffect(()=>{
      if(filter == "all"){
        setfilteredItems(items);
      }
      if(filter == "product"){
        var filtered = items.filter(item=>item.category.includes("Product"));
        setfilteredItems(filtered);
      }
      if(filter == "coupon"){
        var filtered = items.filter(item=>item.category.includes("Coupon"));
        setfilteredItems(filtered);
      }
    },[filter])




    
  const purchaseEvent = () => {
    if(orderTotal > 0){
      if(thePoints - orderTotal >= 0){
        //Enough money
        // toast.success('Order placed');
        setModalOpened(true)
        purchaseItems();
        setitems([]);
      } 
      else{
        //Not enough money
        toast.error('You do not have enough points');
      }
    }else{
      toast.error('You do not have items in your basket');
    }
  };


  const purchaseItems = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();
    const postRef = firestore.collection("users").doc(user.uid);
    const { uuid } = require('uuidv4');
    // const basketRef = postRef.collection("basket");
    //  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
    batch.update(postRef, { points: increment(-orderTotal) });
    // batch.set(heartRef, { uid });
    let theDate = new Date().valueOf();
    theDate = theDate + 1209600000;
    for (let i = 0; i < items.length; i++) {
      let basketItemRef = postRef.collection('basket').doc(items[i].slug);
      batch.delete(basketItemRef);
      let purchasedItemRef = postRef.collection('purchased').doc(uuid());
      batch.set(purchasedItemRef, { description: items[i].description, image: items[i].image, name: items[i].name, price: items[i].price, quantity: items[i].quantity, slug: items[i].slug, total: items[i].total, user: items[i].user, createdAt: theDate  });
    }

    await batch.commit();
  };


   

    return ready? (
      <>
      <Modal
        opened={Modalopened}
        onClose={() => setModalOpened(false)}
        title="Notification"
      >
        <Center>
          <CircleCheck
            size={48}
            strokeWidth={2}
            color={'green'}
          />
        </Center>
        <Center>
          <Text size="xl">Purchase completed</Text>
        </Center>
        <Center>
          <Text size="md">You can view the barcode</Text>
        </Center>
        <Center>
          <Text size='md'>in the "Purchased items" section</Text>
        </Center>
      </Modal>

      <div className='basket-top'>
        <div className='basket-card-container'>
            <Space h="lg" />
            <Center>
              <Text weight={600} size="xl" className='white-title'>Basket</Text>
            </Center>
            <Space h="lg" />
          <Card
            shadow="md"
            radius={25}
          >
          <Group position='apart'>
            <Text weight={500} size="md">
              Your points:
            </Text>
            <Text size="sm">
              {thePoints}
            </Text>
          </Group>
            <Divider my="sm" />
            <Group position='apart'>
            <Text weight={500} size="md">
              Order Total:
            </Text>
            <Text size="sm">
              {orderTotal}
            </Text>
          </Group>
          </Card>
          <Space h={30}/>
          <Center>
            <button className='button-in-basket' onClick={purchaseEvent}>
              Purchase
            </button>
          </Center>
          <Space h={20}/>
        </div>
      </div>
        <div className="box-center">
        <div className='profilePageSpacer'></div>
           {/* <div className="point-store-bar" style={styles.container}>
                    <div style={styles.UserPoint_container}> 
                    <button className='product-button' onClick={allSelected}>All</button>
                    </div>
                    <div style={styles.UserPoint_container}> 
                    <button className='product-button' onClick={productSelected}>Product</button>
                    </div>
                    <div style={styles.UserPoint_container}> 
                    <button className='product-button' onClick={couponSelected}>Coupon</button>
                    </div>
           </div>   */}
           {items ? items.map((item) => <StoreItem key={item.image} user={item.user} price={item.price} description={item.description} image={item.image} quantity={item.quantity} slug={item.slug} total={item.total} name={item.name}/>) : null}
          
        </div>
        
        </>
    ) : (
        <></>
    )
  }

function StoreItem({ description, image, quantity, slug, total, name, price, user }) {
    // Naive method to calc word count and read time
    //const wordCount = post?.content.trim().split(/\s+/g).length;
    //const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    const [value, setValue] = useState(0);
  
    const removeItem = async () => {
      // window.location.reload(); 
      console.log("test: " + user, "slug: ", slug);
      toast.success('Remove ' + name + ' from basket');
      const DocRef = firestore.collection("users").doc(user).collection("basket").doc(slug);
      const batch = firestore.batch();
      // batch.update(DocRef, { heartCount: increment(-1) });
      batch.delete(DocRef);
  
      await batch.commit();
      window.location.reload(false);
    }
    
    // function reloadPage() {
    //   window.location.reload(false);
    // }


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
          <img src={image} width="150" height="150" className='shop-item-image'></img> 
        </div>
        
        {/* <CardContent>
          <Typography>
            {item.name}
          </Typography>
        </CardContent> */}
      {/* </CardActionArea> */}
        <div className='flex8'>
          <div className='shop-item-content'>
            <div className='shop-item-topic'>{name}</div>
            <div className='shop-item-text'>Points: {price}</div>
            {/* <input type="number" id="points" name="points"> */}
            {/* <div className='shop-item-text'>Quantity: {item.quantity}</div> */}
            <div className='shop-item-text'>Quantity: {quantity}</div> 
            <div className='shop-item-text'>Total: {total}</div>
          </div>
        </div>
  
        <div className='flex1'>
          <div className='shop-button-column'>
            <button className='shop-button' onClick={() => { removeItem();}}>Remove</button>
          </div>
          {/* <div className='shop-button-column'>
            <button className='shop-button' onClick={addToBasket} disabled={value == 0}>Add to cart</button>
          </div> */}
        </div>
      </div>
      {/* </NextLink> */}
  
      </Card>
    </div>
    );
  }

