import { ShipmentModel } from '../models/shipment.model';
import { componentLoader, Components } from '../index';
import pdfGenerator from '../custom_components/pdfgenerator';
import { ResourceOptions, FeatureType } from 'adminjs';

interface CreateResourceResult<T> {
  resource: T;
  options: ResourceOptions;
  features?: FeatureType[];
}

export const createShipmentResource = (): CreateResourceResult<typeof ShipmentModel> => ({
  resource: ShipmentModel,
  features: [],
  options: {
    navigation: {
      name: 'Shipments',
      icon: 'LocalShipping'
    },
    actions: {
      // new: {
      //   after: [geocode]
      // },
      // edit: {
      //   after: [geocode]
      // },
      PDFGenerator: {
        actionType: 'record',
        icon: 'GeneratePdf',
        component: Components.PDFGenerator,
        handler: (request, response, context) => {
          const { record, currentAdmin } = context;
          return {
            record: record.toJSON(currentAdmin),
            url: pdfGenerator(record.toJSON(currentAdmin))
          };
        }
      }
    },
    properties: {
      id: {
        isVisible: false
      },
      shipperInfo: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      },
      recipientInfo: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      },
      shipmentDetails: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      }
    }
  }
});
