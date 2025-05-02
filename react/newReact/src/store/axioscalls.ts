
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


const globalAPI="localhost:7001"
const paintingURL='api/painting'

export const fetchPaintings=async()=>{
    try{
        const response=
        await axios.get(`${globalAPI}/${paintingURL}`);
        return response.data
    }catch(error){
        console.log(error);
        
        throw error
    }
}
// {
//     "ownerId": 0,
//     "name": "string",
//     "subject": 0,
//     "paintingFile": "string"
//  }
export const addPainting=async (painting:PaintingToAddType)=>{
    try{
        const response=
        await axios.post(`${globalAPI}/${paintingURL}`,painting)
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}

export const addLike=async (id:number)=>{
    try{
        const response=
        await axios.post(`${globalAPI}/${paintingURL}/${id}/like`)
        return response.data
    }catch(error){
        console.log(error);
        throw error
    }
}