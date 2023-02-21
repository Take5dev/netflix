import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";

import classes from '../styles/Login.module.css';

const LoginPage = (props) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleRouterComplete = () => {
            setLoading(false);
        };
        router.events.on('routeChangeComplete', handleRouterComplete);
        router.events.on('routeChangeError', handleRouterComplete);
        return () => {
            router.events.off('routeChangeComplete', handleRouterComplete);
            router.events.off('routeChangeError', handleRouterComplete);
        }
    }, [router]);

    const handleOnChangeEmail = (event) => {
        setUserMsg("");
        const userEmail = event.target.value;
        setEmail(userEmail);
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        if (email) {
            setLoading(true);
            try {
                const didToken = await magic.auth.loginWithMagicLink({ email, showUI: true });
                if (didToken) {
                    const response = await fetch('/api/login', {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${didToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const loggenInResponse = await response.json();
                    if (loggenInResponse.done) {
                        router.push("/");
                    }
                    else {
                        console.error("Auth JWT/Hasura Error", err);
                        setLoading(false);
                    }

                }
            } catch (err) {
                console.error("Magic Auth Error", err);
                setLoading(false);
            }
        }
        else {
            setUserMsg("Please use a valid email");
            setLoading(false);
        }
    };
    return <div className={classes.container}>
        <Head>
            <title>Netflix Sign In</title>
            <meta name="description" content="Netflix Sign In" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className={classes.header}>
            <div className={classes.headerWrapper}>
                <Link className={classes.logoLink} href="/">
                    <span className={classes.logo}>
                        <Image src="/static/netflix.svg" alt="Netflix" title='Netflix' width={128} height={34} />
                    </span>
                </Link>
            </div>
        </header>
        <main className={classes.main}>
            <div className={classes.mainWrapper}>
                <h1 className={classes.header}>Sign In</h1>
                <input className={classes.emailInput} type="email" placeholder="E-mail address" onChange={handleOnChangeEmail} />
                {userMsg && <p className={classes.userMsg}>{userMsg}</p>}
                <button className={classes.loginBtn} onClick={handleLogin}>{loading ? `Loading...` : `Sign In`}</button>
            </div>
        </main>
    </div>
};

export default LoginPage;