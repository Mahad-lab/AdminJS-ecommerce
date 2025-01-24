import { model, Schema, Types } from 'mongoose'
import { getNames } from 'country-list';
import { codes } from 'currency-codes';

const countries = getNames();
const currencies = codes();

// const status = [
//     "Shipment Created",
//     "Tracking Number Recieved",
//     "Shipment Picked Up",
//     "Shipment Arrived at Airport",
//     "Shipment is in Custom Clearence",
//     "Shipment is Departed",
//     "Shipment is in Clearance Process",
//     "Shipment Forwarded",
//     "Delivered"
// ]

// Define the status object
const ShipmentStatus = {
    SHIPMENT_CREATED: "Shipment Created",
    TRACKING_NUMBER_RECIEVED: "Tracking Number Recieved",
    SHIPMENT_PICKED_UP: "Shipment Picked Up",
    SHIPMENT_ARRIVED_AT_AIRPORT: "Shipment Arrived at Airport",
    SHIPMENT_IS_IN_CUSTOM_CLEARENCE: "Shipment is in Custom Clearence",
    SHIPMENT_IS_DEPARTED: "Shipment is Departed",
    SHIPMENT_IS_IN_CLEARANCE_PROCESS: "Shipment is in Clearance Process",
    SHIPMENT_FORWARDED: "Shipment Forwarded",
    DELIVERED: "Delivered"
} as const;

// Create a type from the object values
type ShipmentStatusType = typeof ShipmentStatus[keyof typeof ShipmentStatus];

export enum ShipmentService {
    VIA_UK_UPS = 'Via UK ups',
    VIA_UK_DHL = 'Via UK DHL',
    DIRECT_UK_PARCEL_FORCE = 'Direct UK parcel force',
    DIRECT_UK_DPD = 'Direct UK DPD',
    DIRECT_USA_UPS = 'Direct USA via UPS',
    DIRECT_DUBAI = 'Direct Dubai',
    VIA_DUBAI_FEDEX = 'Via Dubai FedEx',
    VIA_DUBAI_DHL = 'Via Dubai DHL',
    VIA_DUBAI_UPS = 'Via Dubai UPS',
    DIRECT_AUSTRALIA = 'Direct Australia',
    KHI_DHL = 'KHI DHL',
    KHI_UPS = 'KHI UPS',
    KHI_FEDEX = 'KHI FedEx',
    SINGAPORE_FEDEX = 'Singapore FedEx',
    SKYNET = 'Skynet',
    EUROPE_NON_DUTY_PAID = 'Europe non duty paid',
    EUROPE_DUTY_PAID = 'Europe duty paid',
    DUBAI_ARAMEX = 'Dubai Aramex',
    UK_DHL_EUROPE_DUTY_PAID = 'UK DHL EUROPE DUTY PAID',
    LOCAL_DUBAI_DUTY_PAID = 'Local Dubai Duty Paid',
    CANADA_DUTY_PAID = 'Canada Duty Paid'
}

export interface Shipment {
    id: Types.ObjectId;
    status: ShipmentStatusType;
    shipper: {
        type: 'individual' | 'company';
        name: string;
        ntn_or_cnic: string;
        email: string;
        phone: number;
        address: string;
        city: string;
        country: typeof countries;
        postCode: string;
    };
    consignee: {
        name: string;
        email: string;
        phone: number;
        addressLine: string;
        addressLine2: string;
        city: string;
        country: typeof countries;
        postCode: string;
    };
    shipment: {
        accountNo: string;
        shipmentType: 'Docs' | 'Non Docs (Flyer)' | 'Non Docs (Box)';
        pieces: number;
        totalVolumetricWeight: number;
        weight: number;
        description: string;
        isFragile: boolean;
        currency: string;
        shippersReference: string;
        service: ShipmentService;
        origin: typeof countries;
        destination: typeof countries;
        comments: string;
    };
}

export const ShipmentSchema = new Schema<Shipment>({
    status: { 
        type: String, 
        required: true, 
        enum: Object.values(ShipmentStatus),
        default: ShipmentStatus.SHIPMENT_CREATED 
    },
    shipper: new Schema({
        type: {
            type: String,
            enum: ['individual', 'company'],
            required: true
        },
        name: {
            type: String,
            required: true,
            // required: function () {
            //     return this.type === 'company';
            // }
        },
        ntn_or_cnic: {
            type: String,
            required: true,
            // required: function () {
            //     return this.type === 'company';
            // }
        },
        // shipperName: {
        //     type: String,
        //     required: function () {
        //         return this.type === 'individual';
        //     }
        // },
        // cnic: {
        //     type: String,
        //     required: function () {
        //         return this.type === 'individual';
        //     }
        // },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true, enum: countries },
        postCode: { type: String, required: true }
    }),
    consignee: new Schema({
        name: { type: String, required: true },
        addressLine: { type: String, required: true },
        addressLine2: { type: String, required: false },
        city: { type: String, required: true },
        country: { type: String, required: true, enum: countries },
        postCode: { type: String, required: true },
        phone: { type: Number, required: true },
        email: { type: String, required: true },
    }),
    shipment: new Schema({
        accountNo: { type: String, required: true },
        shipmentType: {
            type: String,
            enum: ['Docs', 'NonDocsFlyer', 'NonDocsBox'],
            required: true
        },
        pieces: { type: Number, required: true },
        totalVolumetricWeight: { type: Number, required: true },
        weight: { type: Number, required: true },
        description: { type: String, required: true },
        isFragile: { type: Boolean, required: true },
        currency: { type: String, required: true, enum: currencies },
        shippersReference: { type: String, required: false },
        service: {
            type: String,
            enum: Object.values(ShipmentService),
            required: true
        },
        origin: { type: String, required: true, enum: countries },
        destination: { type: String, required: true, enum: countries },
        comments: { type: String },
    }),
}, { timestamps: true });


// Custom validation for shipperInfo
ShipmentSchema.path('shipper').validate(function (value: any) {
    return (value.companyName && value.ntn) || (value.shipperName && value.cnic);
}, 'Either companyName and ntn or shipperName and cnic must be provided.');

export const ShipmentModel = model<Shipment>('Shipments', ShipmentSchema);