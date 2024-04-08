import "./Minesweeper.scss";
import React, { useEffect, useState } from "react";
import NumberDisplay from "./NumberDisplay";
import Face from "./Face";
import { generateCells, openMultipleCells } from "../../utils/utils";
import CellButton from "./CellButton";
import { Cell, CellState, CellValue, Faces } from "../../types/types";
import { MAX_COLS, MAX_ROWS } from "../../constants/constants";

const Minesweeper: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<number>(Faces.smile);
  const [time, setTime] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [bombCount, setBombCount] = useState<number>(10);
  const [haslost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  //Change the face to the scared faced when clicking and back
  //to smiling when not clicking
  useEffect(() => {
    const handleMousedown = () => {
      setFace(Faces.scared);
    };
    const handleMouseup = () => {
      if (hasWon) return;
      setFace(Faces.smile);
    };

    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);

    //unmount the event listeners
    return () => {
      window.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  //only use this if the game is live
  useEffect(() => {
    if (isLive && time < 1000) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isLive, time]);

  useEffect(() => {
    if (haslost) {
      setIsLive(false);
      setFace(Faces.lost);
    }
  }, [haslost]);

  useEffect(() => {
    if (hasWon) {
      setIsLive(false);
      setFace(Faces.won);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();

    //This prevents the clock from starting when you click after winning
    if (hasWon) return;

    // make sure you do not click on a bomb in the beginning
    if (!isLive) {
      if (newCells[rowParam][colParam].value === CellValue.bomb) {
        let isBomb = true;
        while (isBomb) {
          newCells = generateCells();
          if (newCells[rowParam][colParam].value !== CellValue.bomb) {
            isBomb = false;
            break;
          }
        }
      }

      //start the game
      setIsLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.clicked
    ) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true);
      newCells = showAllBombs();
      newCells[rowParam][colParam].isRed = true;
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.clicked;
      setCells(newCells);
    }

    //Check to see if we have won
    let doesUnclickedCellExist: boolean = false;
    for (let row: number = 0; row < MAX_ROWS; row++) {
      for (let col: number = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.unclicked
        ) {
          doesUnclickedCellExist = true;
          break;
        }
      }
    }

    if (!doesUnclickedCellExist) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );

      setHasWon(true);
    }

    setCells(newCells);
  };

  const handleFaceClick = () => (): void => {
    setIsLive(false);
    setTime(0);
    setBombCount(10);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      //start game on left click if game isn't already started
      if (!isLive) setIsLive(true);

      //make a copy of the cells state
      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state === CellState.clicked) {
        return;
      }

      //add flag on left click
      else if (currentCell.state === CellState.unclicked) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setBombCount(bombCount - 1);
        setCells(currentCells);
      }

      //remove flag on left click if flag is present
      else if (currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state = CellState.unclicked;
        setBombCount(bombCount + 1);
        setCells(currentCells);
      }
    };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <CellButton
          key={`${rowIndex}-${colIndex}`}
          onContext={handleCellContext}
          onClick={handleCellClick}
          isRed={cell.isRed}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    for (let i = 0; i < currentCells.length; i++) {
      for (let j = 0; j < currentCells[i].length; j++) {
        currentCells[i][j].state = CellState.clicked;
      }
    }

    return currentCells;
  };

  return (
    <div className="Minesweeper">
      <div className="Header">
        <NumberDisplay value={bombCount} />
        <Face state={face} onClick={handleFaceClick} />
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default Minesweeper;
