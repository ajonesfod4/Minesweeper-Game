import { CellState, CellValue } from "../../types/types";
import "./CellButton.scss";
import React from "react";

interface ButtonProps {
  state: CellState;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  isRed?: boolean;
  value: CellValue;
  row: number;
  col: number;
}

const CellButton: React.FC<ButtonProps> = ({
  state,
  onContext,
  onClick,
  isRed,
  value,
  row,
  col,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.clicked) {
      if (value === CellValue.bomb) {
        return (
          <span role="img" aria-label="bomb">
            &#128163;
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      } else {
        return <span>{value}</span>;
      }
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          &#128681;
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`CellButton ${
        state === CellState.clicked ? "clicked" : ""
      } value-${value} ${isRed ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default CellButton;
