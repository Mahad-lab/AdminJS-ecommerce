import { model, Schema, Types } from 'mongoose'
import { getNames } from 'country-list';
import { codes } from 'currency-codes';

const countries = getNames();
const currencies = codes();

const status = [
    "Shipment Created",
    "Tracking Number Recieved",
    "Shipment Picked Up",
    "Shipment Arrived at Airport",
    "Shipment is in Custom Clearence",
    "Shipment is Departed",
    "Shipment is in Clearance Process",
    "Shipment Forwarded",
    "Delivered"
]

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
    shipper: {
        type: 'individual' | 'company';
        companyName?: string;
        ntn?: string;
        shipperName?: string;
        cnic?: string;
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
    shipmentDetails: {
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
        status: typeof status;
    };
}

export const ShipmentSchema = new Schema<Shipment>({
    shipper: new Schema({
        type: {
            type: String,
            enum: ['individual', 'company'],
            required: true
        },
        companyName: {
            type: String,
            required: function () {
                return this.type === 'company';
            }
        },
        ntn: {
            type: String,
            required: function () {
                return this.type === 'company';
            }
        },
        shipperName: {
            type: String,
            required: function () {
                return this.type === 'individual';
            }
        },
        cnic: {
            type: String,
            required: function () {
                return this.type === 'individual';
            }
        },
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
    shipmentDetails: new Schema({
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
        status: { type: String, required: true, enum: status, default: status[0] }
    })
}, { timestamps: true });


// Custom validation for shipperInfo
ShipmentSchema.path('shipper').validate(function (value: any) {
    return (value.companyName && value.ntn) || (value.shipperName && value.cnic);
}, 'Either companyName and ntn or shipperName and cnic must be provided.');

export const ShipmentModel = model<Shipment>('Shipments', ShipmentSchema);