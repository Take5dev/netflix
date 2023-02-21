import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner/Banner'
import NavBar from '@/components/nav/NavBar'
import SectionCards from '@/components/card/SectionCards'

import classes from '../styles/Home.module.css'
import { getVideos, getPopularVideos, getWatchItAgainVideos } from '@/lib/videos'
import useRedirectUser from '@/utils/redirect-user'

export async function getServerSideProps(context) {

  const { userId, token } = await useRedirectUser(context);
  // if (!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  const disneyVideos = await getVideos('disney trailer');
  const productivityVideos = await getVideos('productivity');
  const travelVideos = await getVideos('travel');
  const popularVideos = await getPopularVideos();
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  return {
    props:
    {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos
    }
  }
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos = []
}) {

  return (
    <>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Netflix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <NavBar username="max.digital@yandex.ru" />
        <Banner id="4zH5iYM4wJo" title="Clifford the Red Dog" subTitle="a very cute dog" imgUrl="/static/clifford.webp" />
        <div className={classes.sectionWrapper}>
          <SectionCards title="Disney" size="large" videos={disneyVideos} />
          <SectionCards title="Watch It Again" size="small" videos={watchItAgainVideos} />
          <SectionCards title="Travel" size="small" videos={travelVideos} />
          <SectionCards title="Productivity" size="medium" videos={productivityVideos} />
          <SectionCards title="Popular" size="small" videos={popularVideos} />
        </div>
      </main>
    </>
  )
}
