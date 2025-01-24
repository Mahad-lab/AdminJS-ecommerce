import { model, Schema, Types } from 'mongoose'

export interface Shipment {
    id: Types.ObjectId;
    shipperInfo: {
        companyName?: string;
        ntn?: string;
        shipperName?: string;
        cnic?: string;
        shipperEmail: string;
        phone: number;
        address: string;
        city: string;
        country: string;
        postCode: string;
    };
    consigneeInfo: {
        name: string;
        address: {
            street: string;
            buildingNumber: string;
            apartamentNumber: string;
            city: string;
            postCode: string;
            country: string;
        };
        phone: number;
        email: string;
        // latitude: string;
        // longtitude: string;
    };
    shipmentDetails: {
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
        trackingNumber: string;
        status: string;
    };
}

export const ShipmentSchema = new Schema<Shipment>({
    shipperInfo: new Schema({
        companyName: { type: String, required: false },
        ntn: { type: String, required: false },
        shipperName: { type: String, required: false },
        cnic: { type: String, required: false },
        shipperEmail: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postCode: { type: String, required: true }
    }),
    consigneeInfo: new Schema({
        name: { type: String, required: true },
        address: new Schema({
            street: { type: String, required: true },
            buildingNumber: { type: String, required: false },
            apartamentNumber: { type: String, required: false },
            city: { type: String, required: true },
            postCode: { type: String, required: true },
            country: { type: String, required: true }
        }),
        phone: { type: Number, required: true },
        email: { type: String, required: true },
        // latitude: { type: String },
        // longtitude: { type: String }
    }),
    shipmentDetails: new Schema({
        weight: { type: Number, required: true },
        dimensions: new Schema({
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            height: { type: Number, required: true }
        }),
        description: { type: String, required: true },
        trackingNumber: { type: String, required: true },
        status: { type: String, required: true }
    })
});


// Custom validation for shipperInfo
// ShipmentSchema.path('shipperInfo').validate(function(value: any) {
//     return (value.companyName && value.ntn) || (value.shipperName && value.cnic);
//   }, 'Either companyName and ntn or shipperName and cnic must be provided.');

export const ShipmentModel = model<Shipment>('Shipments', ShipmentSchema);