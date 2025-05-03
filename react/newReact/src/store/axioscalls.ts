
// export const fetchUsers = async () => {
//     try {
//         const response = 
//         	await axios.get('https://jsonplaceholder.typicode.com/users');
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

import axios from "axios"
import { PaintingToAddType } from "./paintingSlice";
import { UserLoginType } from "./userSlice";


const globalAPI="localhost:7001"
const paintingURL=globalAPI+'/api/painting'
const userURL=globalAPI+'/api/user'
export const fetchPaintings=async()=>{
    try{
        const response=
        await axios.get(paintingURL);
        return response.data
    }catch(error){
        console.log(error);
        
        throw error
    }
}

export const addPainting=async (painting:PaintingToAddType)=>{
    try{
        const response=
        await axios.post(paintingURL,painting)
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}

export const addLike=async (id:number)=>{
    try{
        const response=
        await axios.post(`${paintingURL}/${id}/like`)
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}

export const Login=async(user:UserLoginType)=>{
    try{
        const response=
        await axios.post(userURL,user)
        return response.data
    }catch(e){
        console.log(e);
        throw e
    }
}