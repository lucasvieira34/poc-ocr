import { OcrReadResults } from './ocr-read-results.model';

export class OcrAnalyzeResult {
  version: string;
  modelVersion: string;
  readResults: OcrReadResults[];
}
