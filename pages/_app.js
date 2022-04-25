import Navbar from '../components/Navbar';
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';
import {useUserData} from '../lib/hooks';
import TopNavbar from '../components/TopNavbar';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  
  const userData = useUserData();

  return (
    <><Head>
  <link rel='icon' href='/images/logo.png'/>
  </Head>
    <UserContext.Provider value={userData}>
      {/* <TopNavbar /> */}
      <Component {...pageProps} />
      <Navbar />
      <Toaster/>
    </UserContext.Provider>
    </>
  );
}

export default MyApp;