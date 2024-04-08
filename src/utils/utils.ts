import { MAX_COLS, MAX_ROWS, NUM_OF_BOMB } from "../constants/constants";
import { Cell, CellValue, CellState } from "../types/types";

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.unclicked,
      });
    }
  }

  // randomly put 10 bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUM_OF_BOMB) {
    const row = Math.floor(Math.random() * MAX_ROWS);
    const col = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[row][col];

    if (currentCell.value !== CellValue.bomb) {
      cells[row][col].value = CellValue.bomb;
      bombsPlaced++;
    }
  }

  // calculate numbers for each cell
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      //don't change anything if the value of the cell is a bomb
      if (cells[i][j].value === 9) continue;

      let arr: number[] = [];

      //count top left corner
      if (i === 0 && j === 0) {
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        arr.push(cells[i + 1][j].value);
        arr.push(cells[i + 1][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count top row between corners
      if (i === 0 && j > 0 && j < 8) {
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        arr.push(cells[i + 1][j - 1].value);
        arr.push(cells[i + 1][j].value);
        arr.push(cells[i + 1][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count top right corner
      if (i === 0 && j === 8) {
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i + 1][j - 1].value);
        arr.push(cells[i + 1][j].value);
        cells[i][j].value = countBombs(arr);
      }

      //count leftmost cells between left corners
      if (i > 0 && i < 8 && j === 0) {
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i - 1][j + 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        arr.push(cells[i + 1][j].value);
        arr.push(cells[i + 1][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count middle cells
      if (i > 0 && i < 8 && j > 0 && j < 8) {
        arr.push(cells[i - 1][j - 1].value);
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i - 1][j + 1].value);
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        arr.push(cells[i + 1][j - 1].value);
        arr.push(cells[i + 1][j].value);
        arr.push(cells[i + 1][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count rightmost cells between right corners
      if (i > 0 && i < 8 && j === 8) {
        arr.push(cells[i - 1][j - 1].value);
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i + 1][j - 1].value);
        arr.push(cells[i + 1][j].value);
        cells[i][j].value = countBombs(arr);
      }

      //count bottom left corner cell
      if (i === 8 && j === 0) {
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i - 1][j + 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count bottom cells between corners
      if (i === 8 && j > 0 && j < 8) {
        arr.push(cells[i - 1][j - 1].value);
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i - 1][j + 1].value);
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        arr.push(cells[i][j + 1].value);
        cells[i][j].value = countBombs(arr);
      }

      //count bttom right corner cell
      if (i === 8 && j === 8) {
        arr.push(cells[i - 1][j - 1].value);
        arr.push(cells[i - 1][j].value);
        arr.push(cells[i][j - 1].value);
        arr.push(cells[i][j].value);
        cells[i][j].value = countBombs(arr);
      }
    }
  }

  return cells;
};

const countBombs = (arr: number[]): number => {
  let bombCount: number = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 9) bombCount++;
  }
  return bombCount;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  let newCells = cells.slice();

  newCells[rowParam][colParam].state = CellState.clicked;

  const {
    topCell,
    leftCell,
    rightCell,
    bottomCell,
    topLeftCell,
    topRightCell,
    bottomLeftCell,
    bottomRightCell,
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    leftCell?.state === CellState.unclicked &&
    leftCell.value !== CellValue.bomb
  ) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.clicked;
    }
  }

  if (
    topCell?.state === CellState.unclicked &&
    topCell.value !== CellValue.bomb
  ) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.clicked;
    }
  }

  if (
    rightCell?.state === CellState.unclicked &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.clicked;
    }
  }

  if (
    bottomCell?.state === CellState.unclicked &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.clicked;
    }
  }

  if (
    topLeftCell?.state === CellState.unclicked &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.clicked;
    }
  }

  if (
    topRightCell?.state === CellState.unclicked &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.clicked;
    }
  }

  if (
    bottomLeftCell?.state === CellState.unclicked &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.clicked;
    }
  }

  if (
    bottomRightCell?.state === CellState.unclicked &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.clicked;
    }
  }

  return newCells;
};

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};
