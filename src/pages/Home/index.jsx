import { useEffect } from 'react';
import useTitle from '@/hooks/useTitle';
import TweetCard from '@/components/TweetCard';
import NavBar from '@/components/NavBar';
import { Button, PullRefresh, List } from 'react-vant';
import { Plus } from '@react-vant/icons';
import useTweetStore from '@/store/useTweetStore';
import styles from './Home.module.css';

const Home = () => {
    useTitle('Home');

    // 从store获取状态和方法
    const {
        tweets,
        loading,
        refreshing,
        hasMore,
        onRefresh,
        onLoadMore,
        initializeTweets
    } = useTweetStore();

    useEffect(() => {
        initializeTweets();
    }, []); // 只在组件挂载时执行一次

    return (
        <div className={styles.homeContainer}>
            {/* 顶部导航栏 */}
            <NavBar title="Home" />

            {/* 推文列表 */}
            <PullRefresh
                loading={refreshing}
                onRefresh={onRefresh}
                className={styles.pullRefresh}
            >
                <List
                    loading={loading}
                    hasMore={hasMore}
                    onLoad={onLoadMore}
                    className={styles.tweetList}
                >
                    {tweets.map((tweet) => (
                        <TweetCard key={tweet.id} tweet={tweet} />
                    ))}
                </List>
            </PullRefresh>

            {/* 发推按钮 */}
            <Button
                className={styles.composeButton}
                round
                type="primary"
                icon={<Plus />}
            />
        </div>
    );
};

export default Home;