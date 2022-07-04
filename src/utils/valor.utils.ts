export const getValorTotal = (total: string, text: string): string => {
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
};

export const getValorTotalByRegex = (text: string): string => {
  let total = text.replace(/ /g, '').replace(/[^\d|.,]/g, '');

  if (total.includes(',') && total.includes('.')) {
    total = total.replace(/\./g, '').replace(/\,/g, '.');
  } else if (total.includes(',') && !total.includes('.')) {
    total = total.replace(/\,/g, '.');
  }
  return total;
};

export const adjustDecimalChars = (total: string): string => {
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
};

export const getValorTotalByRegexWithSlip = (text: string): string => {
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
};