import { Faces } from "../../types/types";
import "./Face.scss";
import React from "react";

/**
 * Faces
 * Happy: &#128522;
 * Scared: &#128559;
 * Dead: &#128565;
 * Sunglasses: &#128526;
 */

interface FaceProps {
  state: number;
  onClick(): (...args: any[]) => void;
}

const Face: React.FC<FaceProps> = ({ state, onClick }) => {
  const renderFace = (factType: number): React.ReactNode => {
    switch (factType) {
      case Faces.smile:
        return <>&#128522;</>;
      case Faces.scared:
        return <>&#128559;</>;
      case Faces.lost:
        return <>&#128565;</>;
      case Faces.won:
        return <>&#128526;</>;
      default:
        break;
    }
  };

  return (
    <div className="Face" onClick={onClick()}>
      <span role="img" aria-label="face">
        {renderFace(state)}
      </span>
    </div>
  );
};

export default Face;
