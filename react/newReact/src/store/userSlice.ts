

export type UserType={
    id:number,
    name:string,
    cameOn:Date,
    email:string,
    hashedPassword:string,
    birthDate:Date,
    isMedal:boolean,
    role:"member"|"admin",
    lastPaint:Date,
    token?:string
}

export type UserToAddType={
    name:string,
    email:string,
    password:string,
    birthDate:Date
}

export type UserLoginType={
    username:string,
    password:string
}

