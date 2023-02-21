import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '../../lib/magic-client'

import classes from './NavBar.module.css';

const NavBar = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [didToken, setDidToken] = useState("");
    useEffect(() => {
        const getMetaData = async () => {
            try {
                const { email } = await magic.user.getMetadata();
                setDidToken(await magic.user.getIdToken());
                if (email) {
                    setUsername(email);
                }
            } catch (error) {
                console.error("Error retrieving user metadata", error);
            }
        }
        getMetaData();
    }, []);

    const [showDropdow, setShowDropdown] = useState(false);
    const handleOnClickHome = (event) => {
        event.preventDefault();
        router.push('/');
    }
    const handleOnClickMyList = (event) => {
        event.preventDefault();
        router.push('/browse/my-list');
    }
    const handleShowDropdown = (event) => {
        event.preventDefault();
        setShowDropdown(prevState => !prevState);
    }
    const handleSignOut = async (event) => {
        event.preventDefault();
        try {
            // await magic.user.logout();
            // router.push('/login');
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error Signing Out", error);
            router.push('/login');
        }
    }
    return <div className={classes.container}>
        <div className={classes.wrapper}>
            <Link className={classes.logoLink} href="/">
                <span className={classes.logo}>
                    <Image src="/static/netflix.svg" alt="Netflix" title='Netflix' width={128} height={34} />
                </span>
            </Link>
            <ul className={classes.navItems}>
                <li className={classes.navItem} onClick={handleOnClickHome}>Home</li>
                <li className={classes.navItem} onClick={handleOnClickMyList}>My List</li>
            </ul>
            <nav className={classes.navContainer}>
                <div>
                    <button className={classes.usernameBtn} onClick={handleShowDropdown}>
                        <span className={classes.username}>{username}</span>
                        <Image src="/static/expand_more.svg" alt="Toggle" title='Toggle' width={24} height={24} />
                    </button>
                    {showDropdow && <div className={classes.navDropdown}>
                        <div>
                            <a onClick={handleSignOut} className={classes.linkName}>Sign Out</a>
                            <div className={classes.lineWrapper}></div>
                        </div>
                    </div>}
                </div>
            </nav>
        </div>
    </div>;
};

export default NavBar;