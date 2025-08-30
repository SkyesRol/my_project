import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowLeft,
    Close,
    Search
} from '@react-vant/icons'
import styles from './SearchBox.module.css'
import { debounce } from '../../utils/index.js'
const SearchBox = (props) => {
    // /api 
    // 单向数据流
    // 子夫通讯
    const [query, setQuery] = useState('');
    const { handleQuery } = props
    // 非受控组件
    const queryRef = useRef(null);

    const handleChange = (e) => {
        let val = e.currentTarget.value
        setQuery(val);
    }

    const displayStyle = query ? { display: 'block' } : { display: 'none' }
    // 1.防抖
    // 2.useMemo 缓存debounce结果 否则会反复执行
    const handleQueryDebounce = useMemo(() => {
        return debounce(handleQuery, 500)
    }, [handleQuery])
    // 给父组件通信--------------------------------------------------------
    useEffect(() => {
        console.log(query, '//////');

        handleQueryDebounce(query);
    }, [query])
    //------------------------------------------------------------------
    const clearQuery = () => {
        setQuery('');
        queryRef.current.value = '';
        queryRef.current.focus();
    }
    return (
        <div className={styles.wrapper}>
            <ArrowLeft onClick={() => history.go(-1)} className={styles.backIcon} />

            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <input
                    type="text"
                    className={styles.ipt}
                    placeholder='搜索 Twitter'
                    ref={queryRef}
                    onChange={handleChange}
                />
                {/* 清除按钮,点一下就消除所有输入框内容，用户体验 */}
                <Close onClick={clearQuery} style={displayStyle} className={styles.clearIcon} />
            </div>
        </div>
    )
}
export default memo(SearchBox);