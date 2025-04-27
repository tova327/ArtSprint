import ShowPaintings from "@/components/showPaintings"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion"
import FileUpload from "./UploadFile"
import { PaintingType } from "@/models/types"
import { useState } from "react"

const PrivateArea=()=>{
    const [myPaintings,setMyPaintings]=useState([] as PaintingType[])
    const [oursPaintings,setOursPaintings]=useState([] as PaintingType[])
    return (<>
        <Accordion type="single" collapsible>
                <AccordionItem value="most">
                    <AccordionTrigger>My Paintings:</AccordionTrigger>
                    <AccordionContent>
                        <ShowPaintings paintings={myPaintings.sort((p1,p2)=>p2.Likes-p1.Likes).slice(0,3)} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="last">
                    <AccordionTrigger>Ours Paintings:</AccordionTrigger>
                    <AccordionContent>
                        <ShowPaintings paintings={oursPaintings} />
                    </AccordionContent>
                </AccordionItem>
                
            </Accordion>

        <div style={{border: '2px bold black', backgroundColor:'gray',borderRadius:5}}>

            <FileUpload/>
        </div>
    
    </>)
}
export default PrivateArea