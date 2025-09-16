import { useUserStore } from "@/store/useUserStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const RequireAuth = ({ children }) => {
    const { isLogin, validateToken } = useUserStore();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            setIsValidating(true);
            const isValid = await validateToken();
            console.log('token status:', isValid);

            setIsValidating(false);

            if (!isValid) {
                navigate('/login', { from: pathname });
            }
        };

        checkToken();
    }, [])

    return (
        <>
            {isValidating ? (
                <div>验证登录中...</div>
            ) : (
                children
            )}
        </>
    )
}
export default RequireAuth;
