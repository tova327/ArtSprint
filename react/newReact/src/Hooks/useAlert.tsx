import { useState } from "react";

const useAlert = ({type,message,isVisible}:{type: 'success' | 'error' | 'warning'|'info'; message: string; isVisible?: boolean}) => {
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'warning'|'info';
        message: string;
        isVisible?: boolean
    }>({ type, message, isVisible });
    const handleOpenAlert = (type: 'success' | 'error' | 'warning'|'info', message: string) => {
        setAlert(prev => ({ ...prev, type, message, isVisible: true }));
        setTimeout(() => {
            setAlert(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };
    return { alert, handleOpenAlert };
}
export default useAlert;