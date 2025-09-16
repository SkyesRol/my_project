// search 全局共享状态
import { create } from 'zustand'
import { getSuggestList, getHotList } from '@/api/search'

const useSearchStore = create((set, get) => {
    // get 读操作
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    return {
        searchHistory,
        suggestList: [], // suggest 返回list
        hotList: [], // 热门搜索
        isHotListLoading: false, // 热门列表加载状态
        isSuggestListLoading: false, // 搜索建议加载状态
        setSuggestList: async (keyword) => {
            set({ isSuggestListLoading: true });
            const res = await getSuggestList(keyword);
            console.log(res);
            set({
                suggestList: res.data,
                isSuggestListLoading: false
            })
        },
        setHotList: async () => {
            set({ isHotListLoading: true });
            const res = await getHotList();
            console.log(res);
            set({
                hotList: res.data,
                isHotListLoading: false
            })

        }
    }
})


export default useSearchStore;