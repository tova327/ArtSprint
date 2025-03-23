export enum ESubject {
    Music,
    Drawing,
    Photography,
    Graphic,
    Writing
}


export type PaintingType = {
    Id: number,
    OwnerId: number,
    Name: string,
    CreatedAt: Date,
    Likes: number,
    Url: string,
    IsMedal: boolean,
    Subject: ESubject,
    Comments: CommentType[],
    CompetitionPainting?: CompetitionPaintingType
}

export type CommentType = {
    Id: number
    Content: string
    UserId: number
    PaintId: number
    CreatedAt: Date
}

export type CompetitionPaintingType = {
    Id: number
    IdPaint: number,
    IdCompetition: number,
    CountPositive: number,
    Place?: number,
    JoinedAt: Date
}