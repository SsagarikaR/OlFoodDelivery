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

export interface forResult{
    ResultSetHeader: {
        fieldCount: number,
        affectedRows: number,
        insertId: number,
        info: string,
        serverStatus: number,
        warningStatus: number,
        changedRows: number
    }
}

export interface forCustomerAddress{
    CustomerAddressID:number,
    CustomerID:number,
    AddressID:number
}

export interface forCreatedOrder{
    OrderID:number,
    CustomerID:number,
    RestaurantID:number,
    CustomerAddressID:number,
    OrderDate:Date,
    status:string
}

export interface forOrderItems{
    "OrderItemsID": number,
    "Quantity": number,
    "ItemName": string,
    "ItemPrice": number,
    "ItemTotalPrice": number
}