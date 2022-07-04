import { InvoiceField } from 'src/application/model/invoice-field.model';
import { NotaFiscal } from 'src/application/model/nota-fiscal.model';
import { getDataEmissaoWithDateFormatInvoiceField } from 'src/utils/invoice.utils';
import { getValorTotal } from 'src/utils/valor.utils';

const cvcService = async (readTexts: string[]): Promise<NotaFiscal> => {
  const notaFiscal = new NotaFiscal()
    .setCnpj('10760260000119')
    .setEndereco('Rua das Figueiras, 501, 8o andar, bairro Jardim, Santo André, SP, CEP 09080-370')
    .setRazaoSocial('CVC BRASIL OPERADORA E AGÊNCIA DE VIAGENS S.A')
    .setUf('SP');

  const fields = new Array<InvoiceField>(
    new InvoiceField().setKey('FORMAPAGAMENTO').setRegexExp(new RegExp('(Pagamento :)', 'im')),
    new InvoiceField().setKey('NUMERONOTA').setRegexExp(new RegExp('Nº do contrato', 'im')),
    getDataEmissaoWithDateFormatInvoiceField(),
    new InvoiceField().setKey('VALORTOTAL').setRegexExp(new RegExp('(totalizam o valor de R\\$)', 'i')),
  );

  // let matchersMap = new Map<string, string[]>();

  for (let i = 0; i < readTexts.length; i++) {
    let text = readTexts[i];

    //ITERAR FIELDS
    fields.forEach((field) => {
      const pattern = field.regexExp;
      if (pattern.test(text.toUpperCase())) {
        if (field.key.includes('DATAEMISSAO')) {
          if (i == readTexts.length - 1 || i == readTexts.length) {
            const dataEmissao = pattern.exec(text)[0].concat(' 00:00:00');
            notaFiscal.setDataEmissao(dataEmissao);
          }
        } else if (field.key.includes('FORMAPAGAMENTO')) {
          const nextLine = readTexts[i + 1];
          if (nextLine.toUpperCase().includes('CRÉDITO') || nextLine.toUpperCase().includes('DÉBITO')) {
            let formaPagamento = nextLine;
            if (nextLine.length > 17) {
              formaPagamento = nextLine.substring(0, 17);
              if (formaPagamento.endsWith(' ')) {
                formaPagamento = formaPagamento.substring(0, 16);
              }
            }
            notaFiscal.setFormaPagamento(formaPagamento);
          }
        } else if (field.key.includes('VALORTOTAL')) {
          if (text.includes('R$')) {
            text = text.split('R$')[1];
          }
          const total = getValorTotal(null, text);
          if (total && !total.startsWith('0')) {
            notaFiscal.setValorTotal(total);
          }
        } else if (field.key.includes('NUMERONOTA')) {
          let numeroNota;
          const previousLine = readTexts[i - 1];
          const nextLine = readTexts[i + 1];
          const resultPattern = new RegExp('(\\d{4}-\\d{10})');
          const firstPartPattern = new RegExp('(\\d{4}-)');
          if (resultPattern.test(previousLine.concat(nextLine))) {
            numeroNota = resultPattern.exec(previousLine.concat(nextLine))[0];
          } else {
            if (firstPartPattern.test(previousLine)) {
              numeroNota = firstPartPattern.exec(previousLine)[0];
            } else if (firstPartPattern.test(nextLine)) {
              numeroNota = firstPartPattern.exec(nextLine)[0];
            }

            if (numeroNota) {
              for (let index = i + 2; index < i + 10; i++) {
                if (resultPattern.test(numeroNota.concat(readTexts[i]))) {
                  numeroNota = resultPattern.exec(numeroNota.concat(readTexts[i]))[0];
                  break;
                }
              }
            }
          }

          if (numeroNota) {
            notaFiscal.setNumeroNota(numeroNota.replace('-', ''));
          }
        }
      }
    });
  }

  return notaFiscal;
};

export default cvcService;
