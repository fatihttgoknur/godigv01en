export interface Godid {
}
export interface User {
    id: number,
    userName: string,
    password: string,
    email: string
}
export interface UserRoleType {
    id: number,
    name: string
}
export interface UserRole {
    id: number,
    user: User,
    role: UserRoleType,
    start: Date,
    end?: Date
}

export interface MachineModel {
    id: number,
    abbreviation: string,
    name: string,
    pictureUrl?: string,
    parts?: Part [],
    ElectricalPower?: number,
    Capacity?: string,
    Explanation?: string,
    Deactive?: boolean,
    ProductionTime?: number,
}

export interface MachineModelPrice {
    id: number,
    model: MachineModel,
    price: number,
    validityDate: Date,
    validityEndDate?: Date
}

export interface Part {
    id: number,
    name: string,
    code: string,
    pictureUrl?: string,
    inMachineModels?: MachineModel[],
    Deactive?: boolean,
    unit?: string
}

export interface PartPrice {
    id: number,
    part: Part,
    price: number,
    validityDate: Date,
    validityEndDate?: Date
}

export interface Service {
    id: number,
    name: string,
    Deactive?: boolean,
}

export interface ServicePrice {
    id: number,
    service: Service,
    price: number,
    validityDate: Date,
    validityEndDate?: Date
}

export interface Customer {
    id: number,
    name: string,
    title?: string,
    address: string,
    TaxEstablishment?: string,
    TaxNumber?: string
}

export interface CustomerDelegate {
    id: number,
    firstName: string,
    lastName: string,
    customer?: Customer,
    phone?: string,
    email?: string,
    startDate: Date,
    endDate?: Date
}

export interface Proforma {
    id: number,
    customer: Customer,
    customerDelegate?: CustomerDelegate,
    machines?: { machine: MachineModel, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number }[],
    parts?: { part: Part, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number}[],
    services?: {service: Service, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number}[]
    percentDiscount?: number,
    deadline: Date,
    notes?: string[],
    createdBy: User,
    createdDate: Date,
    validUntil: Date,
    deactive?: boolean,
    revisedById?: number,
    contactPerson?: string
}