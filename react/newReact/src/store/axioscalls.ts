

import axios from "axios"
import { PaintingToAddType } from "./paintingSlice";
import { UserLoginType, UserToAddType } from "./userSlice";


const globalAPI="https://localhost:7001"
const paintingURL=globalAPI+'/api/painting'
//const userURL=globalAPI+'/api/user'
const authURL=globalAPI+'/api/Auth'
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
//return axios.get(URLConstants.USER_URL, { headers: { Authorization: `Bearer ${data.token}` } });

export const addPainting=async (painting:PaintingToAddType,token:string)=>{
    try{
        const response=
        await axios.post(paintingURL,painting,{headers:{Authorization: `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}

export const addLike=async (id:number,count:number,token:string)=>{
    console.log(count+'  add like');
    try{
        const response=
        await axios.post(`${paintingURL}/${id}/like?count=${count}`,{},{headers:{Authorization: `Bearer ${token}`}})
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}

export const Login=async(user:UserLoginType)=>{
    try{
        console.log(authURL);
        console.log(user);
        
        const response=
        await axios.post(authURL+'/login',user)
        return response.data
    }catch(e){
        console.log("login error");
        
        console.log(e);
        throw e;
    }
}
export const Register=async(user:UserToAddType)=>{
    try{
        const response=
        await axios.post(authURL+'/register',user)
        return response.data
    }catch(e){
        console.log(e);
        throw e;
    }
}