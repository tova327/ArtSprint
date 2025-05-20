import { useEffect, useState } from 'react';
import './App.css';
import { AppDispatch } from './store/store';
import StartPage from './components/StartPage';
import SubApp from './components/SubApp';
import { useDispatch } from 'react-redux';
//import { setUser } from './store/userSlice'; // Import the setUser action
import axios from 'axios';
import { setUser } from './store/userSlice';

function App() {
    const [showStart, setShowStart] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    

    useEffect(() => {
        const isAuth = async () => {
            const authToken = localStorage.getItem('authToken')
            console.log("in isAuth "+authToken);
            
            if (authToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_MY_API_URL}auth/authuser`, authToken, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.status === 200) {
                        dispatch(setUser(response.data)); // Update user state
                        setShowStart(false); // Hide StartPage if authenticated
                    }
                } catch (error) {
                    console.error("User is not authenticated");
                    localStorage.removeItem('authToken')
                }
            }
        }
        isAuth()
    }, [dispatch])

    return (<>

        {showStart ? <StartPage toClose={() => setShowStart(false)} /> : <SubApp />}
    </>
    );
}

export default App;

