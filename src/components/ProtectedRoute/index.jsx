import { useUserStore } from "@/store/useUserStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
const RequireAuth = ({ children }) => {
    const { isLogin } = useUserStore();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    useEffect(() => {
        if (!isLogin) {
            navigate('/login', { from: pathname });
        }
    }, [])

    return (
        <>

            {children}
        </>
    )
}
export default RequireAuth;
