'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import userLogin from '@/firebase/auth';
import trees from './assets/trees.json';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Snowfall = dynamic(() => import('react-snowfall'), { ssr: false });
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    document.title = "Log In";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await userLogin(email, password);
      await router.push('/home');
    } catch (e) {
      setError(e.message);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: trees,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
   <div className="flex justify-center items-center h-screen bg-gradient-to-t from-orange-200">
     <Head>
       <title>Log In</title>
     </Head>
     <div className="-z-10">
       <Snowfall color="#fff"/>
     </div>
     <div className="flex flex-col md:flex-row w-5/6 md:w-3/4 max-w-xl bg-white rounded-xl shadow-xl">
       <div className="hidden md:block w-1/2 rounded-tl-xl rounded-bl-xl bg-gradient-to-br from-[#ffe8ef] to-[#ffe6b3]">
         <div className={"flex flex-col h-full justify-center items-center"}>
         <Lottie
            options={defaultOptions}
            width={300}
            height={250}
           />
         </div>
       </div>
       <div className="w-full md:w-1/2 p-8 flex-col justify-center">
         <form onSubmit={handleLogin} className="flex flex-col gap-3">
           {error && <p className="text-sys-red">{error}</p>}
           <h1 className="text-center text-3xl px-3 pt-3 font-medium">{`Katya's Holiday Countdown`}</h1>
           <p className="text-center">For my homies 🫶🏻</p>
           <div className="flex flex-col space-y-4">
             <div className="flex flex-col space-y-2">
               <label>
                 Email
               </label>
               <input
                 className="p-2.5 border rounded-lg"
                 type="email"
                 placeholder="Enter your e-mail"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="flex flex-col space-y-2">
               <label>
                 Password
               </label>
               <input
                 className="p-2.5 border rounded-lg"
                 type="password"
                 placeholder="Enter provided password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
           </div>
           <button
             className="w-3/4 mt-4 p-2.5 rounded-xl shadow-md self-center bg-[#019D91] text-white font-semibold"
             type="submit"
           >
             Log me in!
           </button>
         </form>
       </div>
     </div>
   </div>
  );
};

export default Home;
