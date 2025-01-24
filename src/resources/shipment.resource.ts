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
    listProperties: [
      'id',
      'shipper.name',
      'consignee.name',
      'shipment.service',
      'status',
    ],
    navigation: {
      icon: 'DeliveryParcel'
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
        isTitle: true,
        isVisible: false
      },
      shipper: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      },
      consignee: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      },
      shipment: {
        isVisible: {
          edit: true,
          show: true,
          list: false
        }
      },
      status: {
        isVisible: {
          list: true,
          edit: false,
          show: true,
          filter: true,
        }
      },
      createdAt: {
        isVisible: {
          list: true,
          edit: false,
          show: true,
          filter: false,
        }
      },
      updatedAt: {
        isVisible: {
          list: true,
          edit: false,
          show: true,
          filter: true,
        }
      },
      'shipper.type': {
        isVisible: {
          list: true,
          edit: true,
          show: true,
          filter: true
        }
      },
      // https://github.com/SoftwareBrothers/adminjs/blob/master/src/backend/decorators/resource/resource-options.interface.ts
      // 'shipper.companyName': {
      //   isVisible: {
      //     list: false,
      //     edit: true,
      //     show: true,
      //     filter: true,
      //   },
      //   isRequired: true,
      //   custom: {
      //     condition: (record) => record?.params?.shipper?.type === 'company',
      //   }
      // },
      // 'shipper.ntn': {
      //   isVisible: {
      //     list: false,
      //     edit: true,
      //     show: true,
      //     filter: true,
      //   },
      //   isRequired: true,
      //   custom: {
      //     condition: (record) => record?.params?.shipper?.type === 'company',
      //   }
      // },
      // 'shipper.shipperName': {
      //   isVisible: {
      //     list: false,
      //     edit: true,
      //     show: true,
      //     filter: true,
      //   },
      //   isRequired: true,
      //   custom: {
      //     condition: (record) => record?.params?.shipper?.type === 'individual',
      //   }
      // },
      // 'shipper.cnic': {
      //   isVisible: {
      //     list: false,
      //     edit: true,
      //     show: true,
      //     filter: true,
      //   },
      //   isRequired: true,
      //   custom: {
      //     condition: (record) => record?.params?.shipper?.type === 'individual',
      //   }
      // },
      "shipment.comments": {
        type: 'textarea',
        props: {
          rows: 3,
        },
      },
      "shipment.pieces": {
        type: 'number',
        // props: {
        //   min: 1,
        //   // type: 'number',
        //   step: 1,
        //   pattern: '[0-9]*',
        //   onKeyPress: (e) => {
        //     if (!/[0-9]/.test(e.key)) {
        //       e.preventDefault();
        //     } else {
        //       e.preventDefault();
        //     }
        //   },
        // },
      },
      "shipment.weight": {
        type: 'number',
      },
      "shipment.totalVolumetricWeight": {
        type: 'number',
      },
    }
  }
});
