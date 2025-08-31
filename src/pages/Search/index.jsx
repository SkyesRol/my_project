import useSearchStore from '@/store/useSearchStore'
import SearchBox from '../../components/SearchBox'
import Loading from '../../components/Loading'
import NavBar from '@/components/NavBar'
import styles from './Search.module.css'
import { useEffect, useState, memo } from 'react'
import useTitle from './../../hooks/useTitle'

const HotListItems = memo((props) => {
    const hotList = props.hotList;
    const hotListStyle = props.hotListStyle;
    return (
        <div className={styles.hot} style={hotListStyle}>
            <h1>为你推荐</h1>
            {
                hotList.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <span className={styles.hotTag}>#</span>
                        {item.city}
                    </div>
                ))
            }
        </div>
    )
})

const Search = () => {
    // 单向数据流
    // 反复生成 useCallback
    const [query, setQuery] = useState('');
    const { suggestList, setSuggestList, hotList, setHotList, isHotListLoading, isSuggestListLoading } = useSearchStore()
    useTitle('Search')
    useEffect(() => {
        setHotList()

    }, [])

    const handleQuery = (query) => {
        // api 请求
        console.log('debounce后', query);
        setQuery(query);
        if (!query) {
            return
        }
        setSuggestList(query)
    }

    const suggestListStyle = {
        display: query ? 'block' : 'none'
    }
    const hotListStyle = {
        display: query ? 'none' : 'block'
    }
    return (
        <div className={styles.container}>
            <NavBar title="Search" />
            <div className={styles.wrapper}>
                <SearchBox handleQuery={handleQuery} />
                {/* 将HotListItems作为组件，更好维护 */}
                {isHotListLoading && !query ? (
                    <Loading />
                ) : (
                    <HotListItems hotList={hotList} hotListStyle={hotListStyle} />
                )}
                <div className={styles.list} style={suggestListStyle}>
                    {isSuggestListLoading ? (
                        <Loading />
                    ) : (
                        suggestList.map((item) => (
                            <div key={item} className={styles.item}>
                                <span>{item}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}
export default Search
