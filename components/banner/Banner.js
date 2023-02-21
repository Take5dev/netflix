import Image from 'next/image';
import { useRouter } from 'next/router';
import classes from './Banner.module.css';

const Banner = (props) => {
    const router = useRouter();
    const { id, title, subTitle, imgUrl } = props;
    const handleOnPlay = (event) => {
        event.preventDefault();
        router.push(`/video/${id}`)
    };
    return <div className={classes.container}>
        <div className={classes.bannerImageWrapper}>
            <Image src={imgUrl} alt={title} title={title} fill style={{ objectFit: 'cover' }} role="presentation" />
        </div>
        <div className={classes.leftWrapper}>
            <div className={classes.left}>
                <div className={classes.nseriesWrapper}>
                    <p className={classes.firstLetter}>N</p>
                    <p className={classes.series}>S E R I E S</p>
                </div>
                <h3 className={classes.title}>{title}</h3>
                <h3 className={classes.subTitle}>{subTitle}</h3>
                <div className={classes.btnWrapper}>
                    <button className={classes.btnWithIcon} onClick={handleOnPlay}>
                        <Image src="/static/play_arrow.svg" alt="play" width={32} height={32} />
                        <span className={classes.playText}>Play</span>
                    </button>
                </div>
            </div>
        </div>
    </div>;
};

export default Banner;