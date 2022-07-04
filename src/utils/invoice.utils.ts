import { InvoiceField } from 'src/application/model/invoice-field.model';

export const getAccessKeyInvoiceField = () => {
  return new InvoiceField()
    .setKey('ACCESSKEY')
    .setRegexExp(new RegExp('(\\d{4}\\ \\d{4}\\ \\d{4}\\ \\d{4}\\ \\d{4}\\ \\d{4})', 'ig'));
};

export const getDataEmissaoWithDateFormatInvoiceField = () => {
  return new InvoiceField().setKey('DATAEMISSAO').setRegexExp(new RegExp('(\\d{1,2}\\/\\d{1,2}\\/\\d{4})', 'g'));
};
