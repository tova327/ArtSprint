

import axios from "axios"
import { PaintingToAddType } from "./paintingSlice";
import { UserLoginType, UserToAddType } from "./userSlice";
import { CommentPostModel } from "./commentSlice";


const globalAPI = import.meta.env.VITE_MY_API_URL
const paintingURL = globalAPI + 'painting'

//const userURL=globalAPI+'/api/user'
const authURL = globalAPI + 'Auth'
export const fetchPaintings = async () => {
    try {
        const response =
            await axios.get(paintingURL);
        return response.data
    } catch (error) {
        console.log(error);

        throw error
    }
}
//return axios.get(URLConstants.USER_URL, { headers: { Authorization: `Bearer ${data.token}` } });

export const addPainting = async (painting: PaintingToAddType, token: string) => {
    try {
        const response =
            await axios.post(paintingURL, painting, { headers: { Authorization: `Bearer ${token}` } })
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const addLike = async (id: number, count: number, token: string) => {
    console.log(count + '  add like');
    try {
        const response =
            await axios.post(`${paintingURL}/${id}/like?count=${count}`, {}, { headers: { Authorization: `Bearer ${token}` } })
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}


export const Login = async (user: UserLoginType) => {
    try {
        console.log('authurl '+authURL);
        
        const response = await axios.post(authURL + '/login', user);
        return response.data; // Return user data if needed
    } catch (e) {
        console.log("login error");
        console.log(e);
        throw e;
    }
}

export const Register = async (user: UserToAddType) => {
    try {
        const response = await axios.post(authURL + '/register', user);
        return response.data; // Return user data if needed
    } catch (e) {
        console.log(e);
        throw e;
    }
}


const commentURL = globalAPI + 'comment';

export const fetchComments = async () => {
    try {
        const response = await axios.get(commentURL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const addComment = async (comment: CommentPostModel, token: string) => {
    try {
        const response = await axios.post(commentURL, comment, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateComment = async (id: number, comment: CommentPostModel, token: string) => {
    try {
        const response = await axios.put(`${commentURL}/${id}`, comment, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteComment = async (id: number, token: string) => {
    try {
        await axios.delete(`${commentURL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const uploadPainting = async (painting: PaintingToAddType, token: string) => {
    const formData = new FormData();
    formData.append('OwnerId', painting.ownerId.toString());
    formData.append('Name', painting.name);
    formData.append('Subject', painting.subject.toString());
    formData.append('paintingFile', painting.paintingFile);

    try {
        const response = await axios.post(`${paintingURL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getTest = async (subject: string) => {
    try {
        const response = await axios.get(`${globalAPI}AI?subject=${subject}`)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const checkAnswers = async ({ subject, questions, answers }: { subject: string, questions: string[], answers: string[] }) => {
    try {
        const response = await axios.post(`${globalAPI}AI/check`, { subject, questions, answers })
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}