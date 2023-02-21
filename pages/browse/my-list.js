import SectionCards from "../../components/card/SectionCards";
import NavBar from "../../components/nav/NavBar";
import { getUserListVideos } from "../../lib/videos";
import UseRedirectUser from "../../utils/redirect-user";
import Head from "next/head";

import classes from '../../styles/MyList.module.css';

export async function getServerSideProps(context) {

    const { userId, token } = await UseRedirectUser(context);
    // if (!userId) {
    //     return {
    //         props: {},
    //         redirect: {
    //             destination: "/login",
    //             permanent: false,
    //         },
    //     };
    // }

    const myListVideos = await getUserListVideos(userId, token);
    return {
        props:
        {
            myListVideos
        }
    }
}

const MyList = ({ myListVideos = [] }) => {
    return <div>
        <Head>
            <title>My List</title>
        </Head>
        <main className={classes.main}>
            <NavBar />
            <div className={classes.sectionWrapper}>
                <SectionCards wrap shouldScale={false} title="My List" size="small" videos={myListVideos} />
            </div>
        </main>
    </div>
};

export default MyList;