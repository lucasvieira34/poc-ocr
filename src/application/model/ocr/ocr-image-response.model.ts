export class OcrImageResponse {
  analyzeId: string;
  status: number;

  setAnalyzeId(analyzeId: string): OcrImageResponse {
    this.analyzeId = analyzeId;
    return this;
  }

  setStatus(status: number): OcrImageResponse {
    this.status = status;
    return this;
  }
}
