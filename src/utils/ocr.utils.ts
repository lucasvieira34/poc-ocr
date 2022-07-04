import { TypeInvoiceEnumeration } from 'src/application/model/enum/type-invoice.enum';

export const getTypeInvoiceByKey = (text: string): TypeInvoiceEnumeration => {
  switch (true) {
    case text.includes('NFC-E'):
      return TypeInvoiceEnumeration.NFCE;
    case text.includes('SAT'):
      return TypeInvoiceEnumeration.SAT;
    case text.includes('NFS-E'):
      return TypeInvoiceEnumeration.NFSE;
    case text.includes('ECF'):
      return TypeInvoiceEnumeration.ECF;
    case text.includes('DANFE'):
      return TypeInvoiceEnumeration.DANFE;
    case text.includes('NFE'):
      return TypeInvoiceEnumeration.NFE;
    case text.includes('ESTACIONAMENTO'):
      return TypeInvoiceEnumeration.PARKING_COUPON;
    case text.includes('CVC'):
      return TypeInvoiceEnumeration.CONTRATO_CVC;
    default:
      return TypeInvoiceEnumeration.INDEFINIDO;
  }
};
