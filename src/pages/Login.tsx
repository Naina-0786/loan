import { useEffect } from "react";
import LoginForm from "../components/login/login";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("dhani_admin_token");
        if (token) {
            navigate("/admin/manage-admin")
        } else {
            navigate("/admin/login")
        }
    },[])
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default Loginpage;