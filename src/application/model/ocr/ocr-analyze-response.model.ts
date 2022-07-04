import { OcrAnalyzeResult } from './ocr-analyze-result.model';
import { OcrError } from './ocr-response-error.model';

export class OcrAnalyzeResponse {
  status: string;
  createdDateTime: string;
  lastUpdatedDateTime: string;
  analyzeResult: OcrAnalyzeResult;
  error: OcrError;
}
