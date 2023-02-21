import { useRouter } from "next/router";
import Modal from 'react-modal';

import classes from '../../styles/Video.module.css';

import cls from 'classnames';
import { getYoutubeVideoByID } from "../../lib/videos";
import NavBar from "../../components/nav/NavBar";
import Like from "../../components/icons/Like";
import DisLike from "../../components/icons/Dislike";
import { useEffect, useState } from "react";

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
    const id = context.params.id;
    const videoArray = await getYoutubeVideoByID(id);

    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },
        revalidate: 10,
    }
}

export async function getStaticPaths() {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
    const paths = listOfVideos.map(id => ({
        params: { id }
    }));
    return {
        paths, fallback: "blocking"
    };
}

const VideoPage = ({ video }) => {
    const router = useRouter();
    const { id } = router.query;
    const { title, publishedAt, description, channelTitle, statistics: { viewCount } = { viewCount: 0 } } = video;
    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDisLike, setToggleDisLike] = useState(false);

    useEffect(() => {
        const getVideoStats = async () => {
            const response = await fetch(`/api/stats/?videoId=${id}`);
            const data = await response.json();
            if (data.length > 0) {
                const favouritedVal = data[0].favourited;
                if (favouritedVal === 1) {
                    setToggleDisLike(false);
                    setToggleLike(true);
                }
                else if (favouritedVal === 0) {
                    setToggleDisLike(true);
                    setToggleLike(false);
                }
            }
            return data;
        }
        getVideoStats();
    }, []);

    const runRatingServise = async (favourited) => {
        return await fetch('/api/stats/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                videoId: id,
                favourited
            })
        });
    }

    const handleToggleLike = async (event) => {
        event.preventDefault();
        const val = !toggleLike;
        setToggleLike(prevState => !prevState);
        setToggleDisLike(toggleLike);

        const favourited = val ? 1 : 0;
        const response = await runRatingServise(favourited);
        const data = await response.json();
    }
    const handleToggleDislike = async (event) => {
        event.preventDefault();
        setToggleDisLike(prevState => !prevState);
        setToggleLike(setToggleDisLike);
        const val = !toggleDisLike;

        const favourited = val ? 0 : 1;
        const response = await runRatingServise(favourited);
        const data = await response.json();
    }
    return <div className={classes.container}>
        <NavBar />
        <Modal
            isOpen={true}
            contentLabel="Watch the video"
            onRequestClose={() => router.back()}
            overlayClassName={classes.overlay}
            className={classes.modal}
        >
            <iframe id="ytplayer" type="text/html" width="100%" height="360" className={classes.videoPlayer}
                src={`http://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
                frameborder="0" />

            <div className={classes.likeDislikeBtnWrapper}>
                <div className={classes.likeBtnWrapper}>
                    <button onClick={handleToggleLike}>
                        <div className={classes.btnWrapper}>
                            <Like selected={toggleLike} />
                        </div>
                    </button>
                </div>
                <button onClick={handleToggleDislike}>
                    <div className={classes.btnWrapper}>
                        <DisLike selected={toggleDisLike} />
                    </div>
                </button>
            </div>

            <div className={classes.modalBody}>
                <div className={classes.modalBodyContent}>
                    <div className={classes.col1}>
                        <p className={classes.publishTime}>{publishedAt}</p>
                        <p className={classes.title}>{title}</p>
                        <p className={classes.description}>{description}</p>
                    </div>
                    <div className={classes.col2}>
                        <p className={cls(classes.subtext, classes.subtextWrapper)}>
                            <span className={classes.textColor}>Cast: </span>
                            <span className={classes.channelTitle}>{channelTitle}</span>
                        </p>
                        <p className={cls(classes.subtext, classes.subtextWrapper)}>
                            <span className={classes.textColor}>View Count: </span>
                            <span className={classes.channelTitle}>{viewCount}</span>
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
};

export default VideoPage;