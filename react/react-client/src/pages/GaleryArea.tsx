import ShowPaintings from "@/components/showPaintings"
import { getAllPaintings, getAllPaintingsLastWeek, getOldPaintings } from "@/functions/paintings.api"
import { PaintingType } from "@/models/types"
import { useEffect, useState } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/pages/ui/accordion"


const GaleryArea = () => {
    const [weekPaintings, setWeekPaintings] = useState([] as PaintingType[])
    const [oldPaintings, setOldPaintings] = useState([] as PaintingType[])
    const[allPaintings,setAllPaintings]= useState([] as PaintingType[])
    useEffect(() => {
        setWeekPaintings(getAllPaintingsLastWeek())
        setOldPaintings(getOldPaintings())
        setAllPaintings(getAllPaintings())
    }, [])

    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem value="most">
                    <AccordionTrigger>Our Winners:</AccordionTrigger>
                    <AccordionContent>
                        <ShowPaintings paintings={allPaintings.sort((p1,p2)=>p2.Likes-p1.Likes).slice(0,3)} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="last">
                    <AccordionTrigger>Last Paintings:</AccordionTrigger>
                    <AccordionContent>
                        <ShowPaintings paintings={weekPaintings} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="old">
                    <AccordionTrigger>Old Paintings:</AccordionTrigger>
                    <AccordionContent>
                        <ShowPaintings paintings={oldPaintings} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default GaleryArea