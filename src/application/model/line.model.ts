export class Line {
  line: string;
  boundingBox: number[];

  setLine(line: string): Line {
    this.line = line;
    return this;
  }

  setBoundingBox(boundingBox: number[]): Line {
    this.boundingBox = boundingBox;
    return this;
  }
}
