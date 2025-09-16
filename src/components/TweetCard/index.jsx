import React from 'react';
import { Image } from 'react-vant';
import { LikeO, ChatO, ShareO } from '@react-vant/icons';
import styles from './TweetCard.module.css';

const TweetCard = ({ tweet }) => {
    const formatTime = (timestamp) => {
        const now = new Date();
        const tweetTime = new Date(timestamp);
        const diffInMs = now - tweetTime;
        
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInMinutes < 1) {
            return '刚刚';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}分钟前`;
        } else if (diffInHours < 24) {
            return `${diffInHours}小时前`;
        } else if (diffInDays < 7) {
            return `${diffInDays}天前`;
        } else {
            // 超过7天显示具体日期
            return tweetTime.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className={styles.tweetCard}>
            <div className={styles.header}>
                <img 
                    src={tweet.user.avatar} 
                    alt={tweet.user.name}
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <div className={styles.userName}>{tweet.user.name}</div>
                    <div className={styles.userHandle}>@{tweet.user.username} · {formatTime(tweet.timestamp)}</div>
                </div>
            </div>
            
            <div className={styles.content}>
                {tweet.content}
            </div>
            
            {tweet.images && tweet.images.length > 0 && (
                <div className={styles.imageGrid}>
                    {tweet.images.map((image, index) => (
                        <Image
                            key={index}
                            src={image.url}
                            alt={image.alt}
                            className={styles.tweetImage}
                            fit="cover"
                        />
                    ))}
                </div>
            )}
            
            <div className={styles.actions}>
                <div className={styles.actionItem}>
                    <ChatO className={styles.actionIcon} />
                    <span className={styles.actionCount}>{tweet.comments}</span>
                </div>
                <div className={styles.actionItem}>
                    <ShareO className={styles.actionIcon} />
                    <span className={styles.actionCount}>{tweet.retweets}</span>
                </div>
                <div className={styles.actionItem}>
                    <LikeO className={styles.actionIcon} />
                    <span className={styles.actionCount}>{tweet.likes}</span>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;