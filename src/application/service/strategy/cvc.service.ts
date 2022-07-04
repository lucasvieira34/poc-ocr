import { InvoiceField } from 'src/application/model/invoice-field.model';
import { NotaFiscal } from 'src/application/model/nota-fiscal.model';

const cvcService = async (readTexts: string[]): Promise<NotaFiscal> => {
  const notaFiscal = new NotaFiscal()
    .setCnpj('10760260000119')
    .setEndereco('Rua das Figueiras, 501, 8o andar, bairro Jardim, Santo André, SP, CEP 09080-370')
    .setRazaoSocial('CVC BRASIL OPERADORA E AGÊNCIA DE VIAGENS S.A')
    .setUf('SP');

  const fields = new Array<InvoiceField>(
    new InvoiceField().setKey('formaPagamento').setRegexExp(new RegExp('(Pagamento :)', 'im')),
    new InvoiceField().setKey('numeroNota').setRegexExp(new RegExp('Nº do contrato', 'im')),
    new InvoiceField().setKey('dataEmissao').setRegexExp(new RegExp('(\\d{1,2})\\/(\\d{1,2})\\/(\\d{4})$')),
    new InvoiceField().setKey('valorTotal').setRegexExp(new RegExp('(totalizam o valor de R\\$)', 'i')),
  );

  // let matchersMap = new Map<string, string[]>();

  for (let i = 0; i < readTexts.length; i++) {
    let text = readTexts[i];

    //ITERAR FIELDS
    fields.forEach((field) => {
      const pattern = field.regexExp;
      if (pattern.test(text.toUpperCase())) {
        if (field.key.toUpperCase().includes('DATAEMISSAO')) {
          if (i == readTexts.length - 1 || i == readTexts.length) {
            const dataEmissao = pattern.exec(text)[0].concat(' 00:00:00');
            notaFiscal.setDataEmissao(dataEmissao);
          }
        } else if (field.key.toUpperCase().includes('FORMAPAGAMENTO')) {
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
        } else if (field.key.toUpperCase().includes('VALORTOTAL')) {
          if (text.includes('R$')) {
            text = text.split('R$')[1];
          }
          const total = getValorTotal(null, text);
          if (total && !total.startsWith('0')) {
            notaFiscal.setValorTotal(total);
          }
        } else if (field.key.toUpperCase().includes('NUMERONOTA')) {
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

function getValorTotal(total: string, text: string): string {
  if (!total) {
    total = getValorTotalByRegex(text);
  }
  if (total.includes('.') && total.length >= 4 && !total.endsWith('.')) {
    total = adjustDecimalChars(total);
  } else {
    total = null;
  }

  if (!total) {
    total = getValorTotalByRegexWithSlip(text);
  }
  return total;
}

function getValorTotalByRegex(text: string): string {
  let total = text.replace(/ /g, '').replace(/[^\d|.,]/g, '');

  if (total.includes(',') && total.includes('.')) {
    total = total.replace(/\./g, '').replace(/\,/g, '.');
  } else if (total.includes(',') && !total.includes('.')) {
    total = total.replace(/\,/g, '.');
  }
  return total;
}

function adjustDecimalChars(total: string): string {
  const indexOfDot = total.indexOf('.');
  try {
    total = total.substring(0, indexOfDot + 3);
  } catch (err) {
    total = null;
  }
  if (!total) {
    total = null;
  }
  return total;
}

function getValorTotalByRegexWithSlip(text: string): string {
  return text
    .split(' ')
    .map((valor) => {
      valor = valor.replace(/[^\\d|\\.|\\,]/g, '');
      if (valor.includes(',') && valor.includes('.')) {
        valor = valor.replace(/\./g, '').replace(/\,/g, '.');
      } else if (valor.includes(',') && !valor.includes('.')) {
        valor = valor.replace(/\,/g, '.');
      }
      return valor;
    })
    .filter((valor) => valor && typeof valor === 'number')
    .reverse()
    .pop();
}

export default cvcService;
