import { InvoiceField } from 'src/application/model/invoice-field.model';
import { NotaFiscal } from 'src/application/model/nota-fiscal.model';
import {
  getAccessKeyInvoiceField,
  getCnpjFornecedorInvoiceField,
  getDataEmissaoWithDateFormatInvoiceField,
  getEnderecoInvoiceField,
} from 'src/utils/pattern.utils';
import { applyCNPJMatcherRules, applyDataEmissaoMatcherRules } from 'src/utils/rules.utils';

const satService = async (readTexts: string[]): Promise<NotaFiscal> => {
  const notaFiscal = new NotaFiscal();

  let accessKey = getAccessKeyByFullText(readTexts);
  notaFiscal.setAccessKey(accessKey);

  const fields = new Array<InvoiceField>(
    getAccessKeyInvoiceField(),
    getCnpjFornecedorInvoiceField(),
    getDataEmissaoWithDateFormatInvoiceField(),
    getEnderecoInvoiceField(),
  );

  for (let i = 0; i < readTexts.length; i++) {
    const text = readTexts[i];
    const nextIndex = i + 1;

    fields.forEach((field) => {
      const pattern = field.regexExp;
      if (pattern.test(text.toUpperCase())) {
        if (field.key.includes('ACCESSKEY')) {
          if (!accessKey) {
            accessKey = getAcessKeyByLines(text, i, readTexts);
            notaFiscal.setAccessKey(accessKey);
          }
        } else if (field.key.includes('DATAEMISSAO')) {
          const dataEmissao = applyDataEmissaoMatcherRules(text);
          if (dataEmissao) notaFiscal.setDataEmissao(dataEmissao);
        } else if (field.key.includes('CNPJ')) {
          let cnpj = applyCNPJMatcherRules(text);
          if (!cnpj && accessKey) {
            cnpj = accessKey.substring(6, 20);
          }
          notaFiscal.setCnpj(cnpj);
        } else if (field.key.includes('ENDERECO')) {
          notaFiscal.setEndereco(text);
        }
      }
    });
  }

  return notaFiscal;
};

function getAccessKeyByFullText(readTexts: string[]) {
  let accessKey;
  for (let i = 0; i < readTexts.length; i++) {
    if (!accessKey) {
      const line = readTexts[i].replace(/ /g, '');
      const nextIndex = i + 1;
      if (line.length === 44 && !isNaN(+line)) {
        accessKey = line;
      } else if (nextIndex < readTexts.length) {
        const nextLine = readTexts[nextIndex].replace(/ /g, '');
        if ((line + nextLine).length === 44 && !isNaN(+(line + nextLine))) {
          accessKey = line + nextLine;
        }
      }
    }
  }
  return accessKey;
}

function getAcessKeyByLines(text: string, i: number, readTexts: string[]): string {
  const nextIndex = i + 1;
  let accessKey = text.replace(/ /g, '').replace(/[^\d]/g, '');
  if (text.length < 44) {
    if (nextIndex < readTexts.length) {
      accessKey += readTexts[nextIndex].replace(/[^\d]/g, '').replace(/ /g, '');
      if (accessKey.replace(/ /g, '').length === 44) {
        accessKey = accessKey.replace(/ /g, '');
      }
    } else {
      accessKey = null;
    }
  }
  return accessKey;
}

export default satService;
