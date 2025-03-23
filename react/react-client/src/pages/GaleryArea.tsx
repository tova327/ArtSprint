import { getAllPaintings } from "@/functions/paintings.api"
import { PaintingType, ESubject } from "@/models/types"
import { useEffect, useState } from "react"

const GaleryArea = () => {
    const [paintings, setPaintings] = useState([] as PaintingType[])

    useEffect(() => {
        setPaintings(getAllPaintings())
    }, [])

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paintings.map((painting) => (
                <div key={painting.Id} className="border rounded-lg overflow-hidden shadow-lg">
                    <img 
                        src={painting.Url} 
                        alt={painting.Name} 
                        className="w-full h-48 object-cover" 
                    />
                    <div className="p-4">
                        <h2 className="text-lg font-bold">{painting.Name}</h2>
                        <p className="text-gray-600">Likes: {painting.Likes} ❤️</p>
                        {painting.CompetitionPainting && (
                            <p className="text-red-500 text-sm">This painting is registered for a competition!</p>
                        )}
                        <button 
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => {
                                // Logic to show more details about the painting
                                alert(`Details for ${painting.Name}: \nCreated At: ${painting.CreatedAt.toLocaleDateString()}\nLikes: ${painting.Likes}\nComments: ${painting.Comments.map(c=>c.Content)}`);
                                if (painting.CompetitionPainting) {
                                    alert(`Competition Joined At: ${painting.CompetitionPainting.JoinedAt.toLocaleDateString()}`);
                                }
                            }}
                        >
                            See More
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GaleryArea
