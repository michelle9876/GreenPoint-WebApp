import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

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
  'Not using plastic bag',
  'Use and buy less plastic package',
  'Use reusable cup',
  'Walk, Bike more, drive less',
  'Plant a tree',
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

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
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

  const [category, setCategory] = React.useState([])
  const [imageUrl, setImageUrl] = useState('');

  const updatePost = async ({ content, published, category, imageURL }) => {
    await postRef.update({
      category,
      content,
      published,
      imageURL,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published, category, imageURL });

    toast.success('Post updated successfully!')
  };
;

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
  
        <ImageUploader/>

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
                })}></input>

        <FormControl sx={{ m: 1, width: 500 }}>
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

      <textarea {...register("content", {            
   required: "content is required",
                    maxLength: {
                        value: 20000,
                        message: 'content is too long'
                    },
                    minLength: {
                        value: 10,
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

        <div className='newsSpace'></div>
      </div>
    </form>
  );
}