import { useDispatch, useSelector } from "react-redux";
import { addLikeAsync, addLikeR, PaintingType } from "../store/paintingSlice"
import { AppDispatch, StoreType } from "../store/store";
import { useEffect, useState } from "react";


const ShowPainting=({painting}:{painting:PaintingType})=>{

    const dispatch = useDispatch<AppDispatch>();
    const userToken=useSelector((store:StoreType)=>store.user.token)
    const[likeAdded,setLikeAdded]=useState(0)
    const addLikeLocal=()=>{
        setLikeAdded(likeAdded+1)
        dispatch(addLikeR(painting.id));
    }

    useEffect(()=>{
        return()=>{
            if(userToken)
                dispatch(addLikeAsync({id:painting.id,count:likeAdded,token:userToken}))
            else{
                alert("unathorized to add likes")
            }
        }
    },[])
    return (<>
        <div>
            <h2>{painting.name}</h2>
            <a href='https://storage.cloud.google.com/art-sprint-bucket/0-2300.jpg'> see the picture</a>

            <img src="https://storage.cloud.google.com/art-sprint-bucket/0-2300.jpg" alt="######" style={{width:100, maxHeight:150}}/>
           <button onClick={()=>addLikeLocal()} disabled={userToken==null}><h3>number of likes: {painting.likes}</h3></button> 

        </div>
    </>)
}
export default ShowPainting