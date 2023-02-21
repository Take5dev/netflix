import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cls from 'classnames';

import classes from './Card.module.css';

const Card = (props) => {
    const { id, imgUrl = '/https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1038&q=80', size = "medium", shouldScale = true } = props;
    const classMap = {
        'large': classes.lgItem,
        'medium': classes.mdItem,
        'small': classes.smItem,
    };
    const [imgSrc, setImgSrc] = useState(imgUrl);
    const scale = id === 'img-0' ? { scaleY: 1.1 } : { scale: 1.1 };
    const shouldHover = shouldScale && { whileHover: { ...scale } }
    const handleImgError = () => {
        setImgSrc('https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1038&q=80');
    }
    return <div className={classes.container}>
        <motion.div className={cls(classes.imgMotionWrapper, classMap[size])} {...shouldHover}>
            <Image className={classes.cardImg} src={imgSrc} alt="" fill sizes="100vw" onError={handleImgError} />
        </motion.div>
    </div>
};

export default Card;