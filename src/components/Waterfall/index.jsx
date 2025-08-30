import styles from './Waterfall.module.css'
import { useEffect, useRef } from 'react';
import ImageCard from '@/components/ImageCard';

const Waterfall = (props) => {
    const {
        loading,
        fetchMore,
        images
    } = props;

    const loader = useRef(null);

    useEffect(() => {
        // ref 出现在视窗了 intersectionObserver
        // 观察者模式
        const observer = new IntersectionObserver(([entry], obs) => {
            //console.log(entry); // 拖到底部自动输出
            if (entry.isIntersecting) {
                fetchMore();

            }
            //obs.unobserve(entry.target);
        })
        if (loader.current) observer.observe(loader.current);
        return () => {
            observer.disconnect(); // 会停止对所有元素的监听，并释放相关资源
        }
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.column}>
                {
                    images.filter((_, i) => i % 2 === 0).map(img => (
                        <ImageCard key={img.id} {...img} />
                    ))
                }
            </div>
            <div className={styles.column}>
                {
                    images.filter((_, i) => i % 2 !== 0).map(img => (
                        <ImageCard key={img.id} {...img} />


                    ))
                }
            </div>
            <div ref={loader} className={styles.loader}>加载中......</div>
        </div>
    )

}

export default Waterfall