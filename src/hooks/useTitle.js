import { useEffect } from 'react'

function useTitle(title) {
    useEffect(() => {
        if (title) {
            document.title = title
        }
    }, [title])
}

export default useTitle