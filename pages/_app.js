import Loading from '@/components/loading/Loading';
import '@/styles/globals.css'
import { Roboto_Slab } from '@next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '../lib/magic-client';

const robotoslab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: "swap"
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();

        if (isLoggedIn) {
          router.push('/');
        }
        else {
          router.push('/login');
        }
      }
      catch (err) {
        console.error("Error checking log in state", err)
      }
    }
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    }
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    }
  }, [router]);

  return <main className={robotoslab.className}>
    {isLoading ? <Loading /> : <Component {...pageProps} />}
  </main>
}
