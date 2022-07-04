import { OcrLines } from './ocr-lines.model';

export class OcrReadResults {
  page: number;
  angle: number;
  width: number;
  height: number;
  unit: string;
  lines: OcrLines[];
}
