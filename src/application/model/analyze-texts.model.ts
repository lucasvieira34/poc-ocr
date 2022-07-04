export class AnalyzeTexts {
  analyzeId: string;
  width: number;
  height: number;
  texts: string[];

  setAnalyzeId(analyzeId: string): AnalyzeTexts {
    this.analyzeId = analyzeId;
    return this;
  }
  setWidth(width: number): AnalyzeTexts {
    this.width = width;
    return this;
  }
  setHeight(height: number): AnalyzeTexts {
    this.height = height;
    return this;
  }
  setTexts(texts: string[]): AnalyzeTexts {
    this.texts = texts;
    return this;
  }
}
