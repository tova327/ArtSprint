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

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await axios.get('https://localhost:7001/api/auth/check', { withCredentials: true }); // Create this endpoint
    //             if (response.status === 200) {
    //                 dispatch(setUser(response.data)); // Update user state
    //                 setShowStart(false); // Hide StartPage if authenticated
    //             }
    //         } catch (error) {
    //             console.error("User is not authenticated");
    //         }
    //     };

    //     checkAuth();
    // }, [dispatch]);

    useEffect(() => {
        const isAuth = async () => {
            const authToken = localStorage.getItem('authToken')
            if (authToken) {
                try {
                    const response = await axios.post('http://localhost:5208/api/auth/authuser', authToken, {
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

