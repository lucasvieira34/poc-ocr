import { InvoiceField } from 'src/application/model/invoice-field.model';

export const getDataEmissaoWithDateFormatInvoiceField = () => {
  return new InvoiceField().setKey('DATAEMISSAO').setRegexExp(new RegExp('(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$'));
};
