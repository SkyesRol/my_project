import useTitle from '@/hooks/useTitle'
import {
    useState,
    useEffect
} from 'react'
import { useUserStore } from '@/store/useUserStore'
import NavBar from '@/components/NavBar'
import {
    Image,
    Cell,
    CellGroup,
    ActionSheet,
    Popup,
    Loading
} from 'react-vant'
import {
    ServiceO,
    FriendsO,
    StarO,
    SettingO,
    UserCircleO,
    AddO,
    CartO,
    ChatO,
    FireO,
    LikeO,
    Search,
    HomeO,
    UserO
} from '@react-vant/icons'
import styles from './account.module.css'
const Account = () => {
    const gridData = [
        { icon: <AddO />, text: '添加' },
        { icon: <CartO />, text: '购物车' },
        { icon: <ChatO />, text: '聊天' },
        { icon: <FireO />, text: '热门' },
        { icon: <LikeO />, text: '喜欢' },
        { icon: <StarO />, text: '收藏' },
        { icon: <Search />, text: '搜索' },
        { icon: <HomeO />, text: '首页' },
        { icon: <UserO />, text: '我的' }
    ];

    useTitle('My account');
    const { user, validateToken } = useUserStore();
    const [userInfo, setUserInfo] = useState({
        nickname: '奶龙',
        slogan: '我是奶龙',
        avatar: 'https://p3.music.126.net/YgK8jQRrhm2FRH_gAChG2A==/109951166176194555.jpg',
        level: '5级'
    })


    return (
        <>
            <NavBar title="Account" />
            <div className={styles.container}>

                <div className={styles.user}>
                    <Image
                        round
                        width="64px"
                        height="64px"
                        src={userInfo.avatar}
                        style={{ cursor: 'pointer' }}
                    />

                    <div className='ml4'>
                        <div className={styles.nickname}>昵称：{userInfo.nickname}</div>
                        <div className={styles.level}>等级：{userInfo.level}</div>
                        <div className={styles.slogan}>签名：{userInfo.slogan}</div>
                    </div>
                </div>
                <div className='mt3'>
                    <CellGroup inset>
                        <Cell title='服务' icon={<ServiceO />} isLink />
                    </CellGroup>
                    <CellGroup inset className='mt2'>

                        <Cell title="收藏" icon={<StarO />} isLink />
                        <Cell title="朋友圈" icon={<FriendsO />} isLink />
                    </CellGroup>

                    <CellGroup inset className='mt2'>
                        <Cell title="设置" icon={<SettingO />} isLink />
                    </CellGroup>

                </div>
                <div className={styles.gridContainer}>
                    {
                        gridData.map((item, index) => (
                            <div key={index} className={styles.gridItem}>
                                <div className={styles.icon}>
                                    {item.icon}
                                </div>
                                <div className={styles.text}>
                                    {item.text}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
export default Account
