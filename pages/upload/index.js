import AuthCheck from '../../components/AuthCheck';
import styles from '../../styles/Admin.module.css';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp, increment } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { Image, Center, Space, Text } from '@mantine/core'; 
import ImageUploader from '../../components/ImageUploader';
import { v4 as uuidv4 } from 'uuid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';


import ListItemText from '@mui/material/ListItemText';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function UploadPage(props) {
  return (
    <main>
      <AuthCheck>
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}
function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const [imageUrl, setImageUrl] = useState(null);

  const [theTextArea, setTextArea] = useState("");
  const [category, setCategory] = useState([]);
  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));
  const theUUID = uuidv4();

  // Validate length
  const isValid = title.length > 3 && title.length < 100 && theTextArea.length >= 3 && theTextArea.length <= 10000 && imageUrl !== null;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    // const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(theUUID);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug: theUUID,
      uid,
      username,
      published: true,
      content: theTextArea,
      category: category,
      imageURL: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success('Post created!')

    const batch = firestore.batch();

    const userRef = firestore.collection('users').doc(uid);
    batch.update(userRef, { posts: increment(1), points: increment(10) });

    await batch.commit();

    // Imperative navigation after doc is set
    // router.push(`/admin/${slug}`);
    // router.push(`/admin/${theUUID}`);
    router.push(`/${username}`);
  };


  const categorys = [
    'Recyle',
    'No plastic bag',
    'Use less plastic package',
    'Use reusable cup',
    'Walk, Bike more',
    'Plant a tree',
    'Others'
  ];

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div className='upload-container'>
    <form onSubmit={createPost}>
      {imageUrl && <Image
            radius="xs"
            src={imageUrl}
            alt="Image to upload"
          />}

      <Space h={20}/>

      <Center>
          <ImageUploader updateParent={setImageUrl}/>
      </Center>

      <Space h={20}/>
      <Text weight={500} size="xl">Title</Text>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title of the post"
        className={styles.input2}
      />

      <Space h={20}/>

      <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
      <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={category}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {categorys.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={category.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>

      {/* <p>
        <strong>Slug:</strong> {slug}
      </p> */}
      <Space h={20}/>
      <Text weight={500} size="xl">Description</Text>
      <textarea value={theTextArea} onChange={(e) => setTextArea(e.target.value)} placeholder="Describe your environment action"></textarea>
      <Text size="sm">Min words: 3        Max words: 100</Text>
      
      {/* <div>{theTextArea}</div> */}
      <Space h={20}/>
      <Center>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </Center>
      {/* <div>{category}</div> */}
    </form>
    </div>
  );
}

 // Create a new post in firestore
 

