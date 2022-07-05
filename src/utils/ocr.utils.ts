import { PaymentMethod } from 'src/application/model/enum/tipo-pagamento.enum';
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

export const getPaymentMethodByKey = (text: string): PaymentMethod => {
  switch (true) {
    case text.includes('CRÉDITO'):
      return PaymentMethod.CREDITO;
    case text.includes('CREDITO'):
      return PaymentMethod.CREDITO;
    case text.includes('AMERICAN'):
      return PaymentMethod.CREDITO;
    case text.includes('DÉBITO'):
      return PaymentMethod.DEBITO;
    case text.includes('DEBITO'):
      return PaymentMethod.DEBITO;
    case text.includes('DINHEIRO'):
      return PaymentMethod.DINHEIRO;
    default:
      return PaymentMethod.INDEFINIDO;
  }
};
