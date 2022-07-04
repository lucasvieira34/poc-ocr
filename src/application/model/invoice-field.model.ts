export class InvoiceField {
  key: string;
  regexExp: RegExp;

  setKey(key: string): InvoiceField {
    this.key = key;
    return this;
  }
  setRegexExp(regexExp: RegExp): InvoiceField {
    this.regexExp = regexExp;
    return this;
  }
}
