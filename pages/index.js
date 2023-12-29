import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Keyboard = dynamic(() => import('@/components/Keyboard'));

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const tokenCookie = Cookies.get('token_webrtc');

    if (!tokenCookie) {
      console.log('Token not found');
      router.push('/login');
    }
  }, []);

  return <Keyboard />;
};

export default Home;
