import { CommentType, ESubject, PaintingType } from "@/models/types"

const getPaintingsForUser = (userId: number): PaintingType[] => {
    return [{
        Id: 1,
        OwnerId: userId,
        Name: 'piju',
        CreatedAt: new Date(),
        Likes: 8,
        Url: '/',
        IsMedal: false,
        Subject: ESubject.Drawing,
        Comments: [],
        CompetitionPainting: undefined
    },
    {
        Id: 2,
        OwnerId: userId,
        Name: 'tovi',
        CreatedAt: new Date(),
        Likes: 15,
        Url: '/dd',
        IsMedal: true,
        Subject: ESubject.Graphic,
        Comments: [],
        CompetitionPainting: {
            Id: 1,
            IdPaint: 2,
            IdCompetition: 1,
            CountPositive: 14,
            Place: 2,
            JoinedAt: new Date()
        }
    }
    ]
}




const getAllPaintings = ():PaintingType[] => {
    return [{
        Id: 1,
        OwnerId: 2,
        Name: 'piju',
        CreatedAt: new Date(),
        Likes: 8,
        Url: '/',
        IsMedal: false,
        Subject: ESubject.Drawing,
        Comments: [],
        CompetitionPainting: undefined
    },
    {
        Id: 2,
        OwnerId: 3,
        Name: 'tovi',
        CreatedAt: new Date(),
        Likes: 15,
        Url: '/dd',
        IsMedal: true,
        Subject: ESubject.Graphic,
        Comments: [],
        CompetitionPainting: {
            Id: 1,
            IdPaint: 2,
            IdCompetition: 1,
            CountPositive: 14,
            Place: 2,
            JoinedAt: new Date()
        }
    }
    ]
}
function isDateInCurrentWeek(date: Date): boolean {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6)); // Saturday

    return date >= startOfWeek && date <= endOfWeek;
}
const getAllPaintingsLastWeek=():PaintingType[]=>{
    const all=getAllPaintings()
   const weekPaintings=all.filter(p=>isDateInCurrentWeek(p.CreatedAt) )
   return weekPaintings
}


export { getPaintingsForUser, getAllPaintings ,getAllPaintingsLastWeek}