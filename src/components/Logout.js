import {useNavigate} from 'react-router-dom'

export default {
    logout : () => {
        const nav = useNavigate();
        localStorage.removeItem("@app-user");
        nav("/", {});
    }
    
}