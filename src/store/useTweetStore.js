import { create } from 'zustand';
import { getTweets } from '@/api/home';

const useTweetStore = create((set, get) => ({
    // 状态
    tweets: [],
    loading: false,
    refreshing: false,
    page: 1,
    hasMore: true,
    initialized: false,
    requesting: false,

    // 获取推文数据
    fetchTweets: async (pageNum = 1, isRefresh = false) => {
        const { requesting } = get();
        if (requesting) return; // 防止重复请求

        set({ requesting: true });

        try {
            if (isRefresh) {
                set({ refreshing: true });
            } else {
                set({ loading: true });
            }

            const response = await getTweets(pageNum);
            if (response.code === 0) {
                const newTweets = response.data;
                if (isRefresh) {
                    set({
                        tweets: newTweets,
                        page: 1,
                        hasMore: newTweets.length > 0,
                        initialized: true
                    });
                    //console.log(pageNum);

                } else {
                    set(state => ({
                        tweets: [...state.tweets, ...newTweets],
                        page: state.page + 1,
                        hasMore: newTweets.length > 0
                    }));
                    // console.log(pageNum);

                }
            }
        } catch (error) {
            console.error('获取推文失败:', error);
        } finally {
            set({
                loading: false,
                refreshing: false,
                requesting: false
            });
        }
    },

    // 下拉刷新
    onRefresh: async () => {
        const { fetchTweets } = get();
        await fetchTweets(1, true);
    },

    // 加载更多
    onLoadMore: async () => {
        const { loading, refreshing, hasMore, page, fetchTweets } = get();
        if (!loading && !refreshing && hasMore) {
            await fetchTweets(page);
        }
    },

    // 初始化数据
    initializeTweets: async () => {
        const { initialized, fetchTweets } = get();
        if (!initialized) {
            await fetchTweets(1, true);
        }
    },

    // 重置状态
    resetTweets: () => {
        set({
            tweets: [],
            loading: false,
            refreshing: false,
            page: 1,
            hasMore: true,
            initialized: false,
            requesting: false
        });
    }
}));

export default useTweetStore;