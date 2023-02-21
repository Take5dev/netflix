import Link from 'next/link';
import Card from './Card';
import cls from "classnames";
import classes from './SectionCards.module.css';

const SectionCards = (props) => {
    const { size, title, videos = [], wrap = false, shouldScale } = props;
    return <section className={classes.container}>
        <h2 className={classes.title}>{title}</h2>
        <div className={cls(classes.cardWrapper, wrap && classes.wrap)}>
            {videos.map((item, index) => <Link key={`key-${index}`} href={`/video/${item.id}`}>
                <Card id={`img-${index}`} imgUrl={item.imgUrl} size={size} shouldScale={shouldScale} />
            </Link>)}
        </div>
    </section>
};

export default SectionCards;