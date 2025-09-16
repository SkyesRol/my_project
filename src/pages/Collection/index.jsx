import {
    useImageStore
} from '@/store/useImageStore';
import { useEffect } from 'react';
import Waterfall from '@/components/Waterfall';
import NavBar from '@/components/NavBar';
import useTitle from '@/hooks/useTitle'
const Collection = () => {
    const { images, loading, fetchMore } = useImageStore();
    useTitle('Tiktok');
    useEffect(() => {
        fetchMore();
    }, [])
    return (
        <>
            <NavBar title="Tiktok" />
            <Waterfall
                images={images} fetchMore={fetchMore} loading={loading}
            />
        </>
    )
}
export default Collection
