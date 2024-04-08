export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb,
}

export enum CellState {
  unclicked,
  clicked,
  flagged,
}

export type Cell = { value: CellValue; state: CellState; isRed?: boolean };

export enum Faces {
  smile,
  scared,
  lost,
  won,
}
