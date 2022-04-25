import { firestore, auth, increment } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to heart or like a post
export default function FollowButton({ yourID, theirID, yourUsername }) {
  // Listen to heart document for currently logged in user
//   const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
//   const [heartDoc] = useDocument(heartRef);

  const youFollowThemRef = firestore.collection('users').doc(yourID).collection('following').doc(theirID);
  const youAreTheirFollowerRef = firestore.collection('users').doc(theirID).collection('followers').doc(yourID);

  const [youFollowThemDoc] = useDocument(youFollowThemRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };



  const Follow = async () => {
    //Add them to your followings list
    const batch = firestore.batch();

    //get their username
    const usersRef = firestore.collection('users');
    const query = usersRef.where('uid', '==', theirID).limit(1);
    const userDoc = (await query.get()).docs[0];
    let theirUsername = userDoc.data().username;
    batch.set(youFollowThemRef, {uid: theirID, username: theirUsername});

    //Add you to their followers list
    batch.set(youAreTheirFollowerRef, {uid: yourID, username: yourUsername});
    await batch.commit();
    window.location.reload(false);
  }

  const unFollow = async () => {
    const batch = firestore.batch();
    //remove them from your following list
    batch.delete(youFollowThemRef);
    batch.delete(youAreTheirFollowerRef);

    await batch.commit();
    //remove you from their followers list
    window.location.reload(false);
  }

  return youFollowThemDoc?.exists ? (
    <button className='follow-button' onClick={unFollow}>Unfollow</button>
  ) : (
    <button className='follow-button' onClick={Follow}>Follow</button>
  );
}