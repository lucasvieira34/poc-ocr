export class NotaFiscal {
  dataEmissao: string;
  valorTotal: string;
  numeroNota: string;
  cnpj: string;
  endereco: string;
  formaPagamento: string;
  razaoSocial: string;
  serie: string;
  accessKey: string;
  uf: string;
  codigoVerificacao: string;

  setDataEmissao(dataEmissao: string): NotaFiscal {
    this.dataEmissao = dataEmissao;
    return this;
  }
  setValorTotal(valorTotal: string): NotaFiscal {
    this.valorTotal = valorTotal;
    return this;
  }
  setNumeroNota(numeroNota: string): NotaFiscal {
    this.numeroNota = numeroNota;
    return this;
  }
  setCnpj(cnpj: string): NotaFiscal {
    this.cnpj = cnpj;
    return this;
  }
  setEndereco(endereco: string): NotaFiscal {
    this.endereco = endereco;
    return this;
  }
  setFormaPagamento(formaPagamento: string): NotaFiscal {
    this.formaPagamento = formaPagamento;
    return this;
  }
  setRazaoSocial(razaoSocial: string): NotaFiscal {
    this.razaoSocial = razaoSocial;
    return this;
  }
  setSerie(serie: string): NotaFiscal {
    this.serie = serie;
    return this;
  }
  setAccessKey(accessKey: string): NotaFiscal {
    this.accessKey = accessKey;
    return this;
  }
  setUf(uf: string): NotaFiscal {
    this.uf = uf;
    return this;
  }
  setCodigoVerificacao(codigoVerificacao: string): NotaFiscal {
    this.codigoVerificacao = codigoVerificacao;
    return this;
  }
}
