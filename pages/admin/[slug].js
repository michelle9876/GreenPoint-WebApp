import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp, increment } from '../../lib/firebase';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm, useFormState } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
//import { ErrorMessage } from 'hookform/error-message'; // install and import error-message
import ImageUploader from '../../components/ImageUploader';
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Image, Center, Space, Text } from '@mantine/core'; 

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

const categorys = [
  'Recyle',
  'No plastic bag',
  'Use less plastic package',
  'Use reusable cup',
  'Walk, Bike more',
  'Plant a tree',
  'Others'
];


export default function AdminPostEdit(props) {
 
  return (
    <AuthCheck>
        <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const [post] = useDocumentData(postRef);
  console.log("thePost: ", post);
  const theUID = auth.currentUser.uid;

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            {/* <p>ID: {post.slug}</p> */}

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} uid={theUID}/>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm({ defaultValues, mode: 'onChange' });
  const { isValid, isDirty } = useFormState({control});
  // const [category, setCategory] = useState('');
  const [category, setCategory] = useState(defaultValues.category);
  const [imageUrl, setImageUrl] = useState(defaultValues.imageURL);

  React.useEffect(()=>{
    console.log("imageUrl: ", imageUrl);
  }, [imageUrl])
  // const [imgURL, setImgURL] = useState(null);

  // const setTheImgURL = (theIMG) => {
  //   setImageUrl(theIMG);
  // }
  // const updatePost = async ({ content, published, category, imageURL }) => {
  //   await postRef.update({
  //     category,
  //     content,
  //     published,
  //     imageURL,
  //     updatedAt: serverTimestamp(),
  //   });

  //   reset({ content, published, category, imageURL });

  //   toast.success('Post updated successfully!')
  // };

  const updatePost = async ({ content, published, category }) => {
    await postRef.update({
      category,
      content,
      published,
      imageURL: String(imageUrl),
      updatedAt: serverTimestamp(),
    });

    reset({ content, published, category });

    toast.success('Post updated successfully!')
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
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
  


        <div>
        {imageUrl && <Image
            radius="xs"
            src={imageUrl}
            alt="Image to upload"
          />}
        </div>

          <Space h={20}/>

        <Center>
          <ImageUploader updateParent={setImageUrl}/>
        </Center>
        {/* <input 
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Place Image url here "
        className={styles.input}
      /> */}

      {/* <input 
        placeholder="Place Image url here "
        {...register("imageURL", {            
          required: "imageURL is required",
          placeholder: "Place Image url here ",
                           maxLength: {
                               value: 20000,
                               message: 'content is too long'
                           },
                           minLength: {
                               value: 10,
                               message: 'content is too short'
                           }
                       })} /> */}

{/* 
      <input placeholder="Place Image url here "
      {...register("imageURL", {            
   required: "imageURL is required",
                    maxLength: {
                        value: 20000,
                        message: 'content is too long'
                    },
                    minLength: {
                        value: 10,
                        message: 'content is too short'
                    }
                })}></input> */}

        <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
        <Select {...register("category")}
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
      </FormControl>
      <Space h={20}/>
      <Text weight={500} size="xl">Content</Text>

      <textarea {...register("content", {            
   required: "content is required",
                    maxLength: {
                        value: 10000,
                        message: 'content is too long'
                    },
                    minLength: {
                        value: 3,
                        message: 'content is too short'
                    }
                })}></textarea>
        <div>
      <div>

    </div>
        </div>
        

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        {/* <button type="submit" className="btn-green">
          Upload Image
        </button> */}

        <button type="submit" className="btn-green">
          Save Changes
        </button>

        {/* <div className='newsSpace'></div> */}
      </div>
    </form>
  );
}

function DeletePostButton({ postRef, uid }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await postRef.delete();

      const batch = firestore.batch();

      const userRef = firestore.collection('users').doc(uid);
      batch.update(userRef, { posts: increment(-1) });
  
      await batch.commit();


      router.push('/admin');
      toast('post deleted ', { icon: '🗑️' });

      
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}