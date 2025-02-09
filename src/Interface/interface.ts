export interface forNewUser{
    UserID: number,
    UserName: string,
    UserEmail: string,
    UserContactNo: string,
    password?: string,
    token?:string
}

export interface forAddress{
    AddressID:number,
    City:string,
    PINCode:string,
    street:string
}

export interface forDeliveryAssignment{
    DeliveryDriverID:number
}