interface Style {
  name: string;
  confidence: number;
}

interface Appearance {
  style: Style;
}

interface Words {
  boundingBox: number[];
  text: string;
  confidence: number;
}

export class OcrLines {
  boundingBox: number[];
  text: string;
  appearance: Appearance;
  words: Words[];
}
