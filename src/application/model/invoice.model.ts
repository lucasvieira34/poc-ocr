import { TypeInvoiceEnumeration } from './enum/type-invoice.enum';
import { NotaFiscal } from './nota-fiscal.model';

export class InvoiceModel {
  width: number;
  height: number;
  type: TypeInvoiceEnumeration;
  invoice?: NotaFiscal;

  setWidth(width: number): InvoiceModel {
    this.width = width;
    return this;
  }
  setHeight(height: number): InvoiceModel {
    this.height = height;
    return this;
  }
  setType(type: TypeInvoiceEnumeration): InvoiceModel {
    this.type = type;
    return this;
  }
  setInvoice(invoice: NotaFiscal): InvoiceModel {
    this.invoice = invoice;
    return this;
  }
}
