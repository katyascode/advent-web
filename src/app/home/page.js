'use client';

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import GiftBox from '../../app/components/GiftBox';
import santa from '../assets/santa.json';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const HomePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gifts, setGifts] = useState([]);

  const handleGiftOpened = (giftId) => { // Update the local state when a gift is opened
    setGifts((prevGifts) => // Use current version of gifts array
      prevGifts.map((gift) => // Map each gift to a new array that updates the opened gift's state
        gift.id === giftId
          ? { ...gift, opened: true }
          : gift
      )
    );
  };

  const defaultOptions = { // Lottie animation options
    loop: true,
    autoplay: true,
    animationData: santa,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  useEffect(() => {
    document.title = "Katya's Holiday Countdown";
  }, []);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) { // User logged in
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserName(userDocSnapshot.data().name);
            setUserId(user.uid);

            // Fetch user gifts
            const giftsColRef = collection(db, 'users', user.uid, 'gifts');
            const giftsSnapshot = await getDocs(giftsColRef);

            const fetchedGifts = giftsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setGifts(fetchedGifts);
          } else {
            setError('User document not found.');
          }
        } catch (err) {
          setError('Failed to fetch data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.push('/'); // User not logged in: Redirect to login page
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [router]);

  if (isLoading) return (
    <p className="flex flex-col h-screen justify-center items-center text-white text-4xl font-bold">Loading...</p>
  );

  if (error) return (
    <p className="flex flex-col h-screen justify-center items-center text-white text-4xl font-bold">{error}</p>
  );

  return (
    <div className="overflow-x-hidden py-8 flex flex-col h-screen justify-center items-center bg-gradient-to-t from-orange-200">
      <Head>
        <title>{`Katya's Holiday Countdown`}</title>
      </Head>
      <div className="-z-10">
        <Snowfall color="#fff"/>
      </div>
      <div className="absolute w-full h-full mb-24 -z-40 flex justify-center">
        <Lottie
          options={defaultOptions}
          height={500}
          width={2000}
          speed={0.75}
        />
      </div>
      <h1 className="text-white p-10 text-center font-extrabold text-5xl">🌟 Welcome, {userName}! 🌟</h1>
      <div className="space-y-6 w-full flex flex-col items-center">
        {gifts.map((gifts) => (
          <GiftBox gift={gifts} userId={userId} key={gifts.id} onGiftOpened={handleGiftOpened}/>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
