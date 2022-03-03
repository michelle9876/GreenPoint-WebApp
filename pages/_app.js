import Navbar from '../components/Navbar';
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';
import {useUserData} from '../lib/hooks';
import TopNavbar from '../components/TopNavbar';



function MyApp({ Component, pageProps }) {
  
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <TopNavbar />
      <Component {...pageProps} />
      <Navbar />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;