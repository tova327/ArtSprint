import { PaintingType } from "../store/paintingSlice"


const ShowPainting=({painting,clickFunc}:{painting:PaintingType,clickFunc:Function})=>{
    return (<>
        <div>
            <h2>{painting.name}</h2>
           <button onClick={()=>clickFunc()}><h3>number of likes: {painting.likes}</h3></button> 

        </div>
    </>)
}
export default ShowPainting