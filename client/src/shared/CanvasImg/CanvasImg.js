import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import styles from "./CanvasImg.module.css";
const CanvasImg = ({ imageUrl }) => {
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const drawingLayerRef = useRef(null);
  const canvasRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stage = stageRef.current;
    const layer = drawingLayerRef.current;

    const img = new Image();
    img.src = imageUrl;

    const handleImageLoad = () => {
      canvas.width = canvas.parentNode.clientWidth;
      canvas.height = (canvas.width / img.width) * img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      stageRef.current.batchDraw();

      setStageSize({
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
      });
      stage.clear();
      layer.children = [];

      stage.batchDraw();
    };

    const handleResize = () => {
      handleImageLoad();
    };

    img.onload = handleImageLoad;
    window.addEventListener("resize", handleResize);

    return () => {
      img.onload = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [imageUrl]);

  const handleMouseDown = () => {
    setIsDrawing(true);
    const stage = drawingLayerRef.current.getStage();
    const point = stage.getPointerPosition();
    setLines([...lines, { points: [point.x, point.y], color: "red" }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing) {
      return;
    }

    const stage = drawingLayerRef.current.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines([...lines.slice(0, lines.length - 1), lastLine]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className={styles.preview}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`${styles.preview__draw}  ${
          isDrawing ? styles.isActive : ""
        }`}
      >
        <Layer ref={drawingLayerRef}>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
      <div className={`${styles.preview__hover}`}>Hold to draw</div>
      <canvas ref={canvasRef} className={styles.preview__img} />
    </div>
  );
};

export default CanvasImg;
