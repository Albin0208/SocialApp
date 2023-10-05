import axios from '../api/axios';
import { useAuth } from './AuthContext';
const useRefreshToken = () => {
    const { setToken } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setToken(response.data.accessToken);
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;