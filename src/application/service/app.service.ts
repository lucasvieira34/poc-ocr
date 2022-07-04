import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { getTypeInvoiceByKey } from 'src/utils/ocr.utils';
import { AnalyzeTexts } from '../model/analyze-texts.model';
import { TypeInvoiceEnumeration } from '../model/enum/type-invoice.enum';
import { InvoiceModel } from '../model/invoice.model';
import { Line } from '../model/line.model';
import { NotaFiscal } from '../model/nota-fiscal.model';
import { OcrAnalyzeResponse } from '../model/ocr/ocr-analyze-response.model';
import { OcrImageResponse } from '../model/ocr/ocr-image-response.model';
import { asyncOcr, getAnalyzeResultsByOcr, syncOcr } from './client/ocr.client';
import InvoiceStrategy from './strategy.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');

  sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async sendToSynchronousOcr(image: Express.Multer.File): Promise<any> {
    const analyzeTexts = [];
    const response = await syncOcr(image);

    const { regions } = response;

    for (let i = 0; i < regions?.length; i++) {
      const region = regions[i];
      const { lines } = region;
      for (let j = 0; j < lines?.length; j++) {
        const line = lines[j];
        const { words } = line;
        let lineMap = '';
        words.forEach((obj: any) => {
          lineMap += `${obj.text} `;
        });
        analyzeTexts.push(lineMap);
      }
    }
    this.logger.log(analyzeTexts);
    return analyzeTexts;
  }

  async sendToAsynchronousOcr(image: Express.Multer.File): Promise<OcrImageResponse> {
    return await asyncOcr(image);
  }

  async getAnalyzeResultsByOcr(analyzeId: string): Promise<AnalyzeTexts> {
    const analyzeTexts = new AnalyzeTexts().setAnalyzeId(analyzeId);
    const texts: string[] = [];
    let tentativas = 1;
    this.logger.log(`Executando tentativa ${tentativas}`);

    let ocrAnalyzeResponse = await getAnalyzeResultsByOcr(analyzeId);

    if (ocrAnalyzeResponse.error) throwOcrError(ocrAnalyzeResponse);

    while ((!ocrAnalyzeResponse.status || ocrAnalyzeResponse.status === 'running') && tentativas <= 5) {
      this.logger.error(`Erro na ${tentativas} tentativa de leitura.`);
      this.sleep(4000);
      this.logger.log(`Executando tentativa: ${++tentativas}`);
      ocrAnalyzeResponse = await getAnalyzeResultsByOcr(analyzeId);

      if (ocrAnalyzeResponse.error) throwOcrError(ocrAnalyzeResponse);
    }

    if (!ocrAnalyzeResponse.status || ocrAnalyzeResponse.status !== 'succeeded') {
      this.logger.error(`Erro na leitura do OCR em ${tentativas} tentativa(s) para o analyzeId: ${analyzeId}.`);
      throw new HttpException('Erro na leitura do OCR', HttpStatus.PRECONDITION_FAILED);
    }

    const {
      analyzeResult: { readResults },
    } = ocrAnalyzeResponse;

    for (let i = 0; i < readResults.length; i++) {
      const result = readResults[i];

      const { width, height } = result;
      analyzeTexts.setWidth(width);
      analyzeTexts.setHeight(height);

      if (result.lines) {
        const lines = result.lines;
        if (result.unit === 'pixel') {
          let linesMap = new Map<number, Line>();
          for (let j = 0; j < lines.length; j++) {
            const { boundingBox, text } = lines[j];
            const line = new Line().setBoundingBox(boundingBox).setLine(text);
            linesMap = addLine(line, linesMap);
          }

          linesMap.forEach((line) => {
            texts.push(line.line);
          });
          this.logger.log(`Imagem processada com sucesso em ${tentativas} tentativa(s) para o analyzeId: ${analyzeId}`);
        } else {
          for (let j = 0; j < lines.length; j++) {
            texts.push(lines.at(j).text);
          }
        }
      }
    }

    analyzeTexts.setTexts(texts);
    return analyzeTexts;
  }

  async getDadosNotaFiscalByTemplate(analyzeId: string): Promise<InvoiceModel> {
    const nota = await this.getAnalyzeResultsByOcr(analyzeId);
    const { width, height } = nota;

    const readTexts = nota.texts;

    const typeInvoice: TypeInvoiceEnumeration = readTexts
      .map((text) => getTypeInvoiceByKey(text.toUpperCase()))
      .filter((typeInvoice) => typeInvoice != TypeInvoiceEnumeration.INDEFINIDO)
      .reverse()
      .pop();

    const invoiceStrategy = InvoiceStrategy[typeInvoice];
    let invoice: NotaFiscal;
    if (invoiceStrategy) {
      invoice = await invoiceStrategy(readTexts);
    }

    return new InvoiceModel()
      .setWidth(width)
      .setHeight(height)
      .setType(typeInvoice ? typeInvoice : TypeInvoiceEnumeration.INDEFINIDO)
      .setInvoice(invoice);
  }
}

function throwOcrError(ocrAnalyzeResponse: OcrAnalyzeResponse) {
  const ocrError = ocrAnalyzeResponse.error;
  throw new HttpException(ocrError.message, HttpStatus.BAD_REQUEST);
}

function addLine(newLine: Line, linesMap: Map<number, Line>): Map<number, Line> {
  let isNewLine = true;

  linesMap.forEach((lines, index) => {
    const line = linesMap.get(index);
    if (equalsLine(line.boundingBox, newLine.boundingBox)) {
      isNewLine = false;

      line.setLine(`${line.line} ${newLine.line}`);
      linesMap.set(index, line);
    }
  });

  if (isNewLine) {
    linesMap.set(linesMap.size, newLine);
  }
  return linesMap;
}

function equalsLine(boundingBox: number[], newBoundingBox: number[]): boolean {
  for (let i = 0; i < boundingBox.length; i += 2) {
    const result = boundingBox.at(i) - newBoundingBox.at(i);
    if (result < -10 || result > 10) {
      return false;
    }
  }
  return true;
}
