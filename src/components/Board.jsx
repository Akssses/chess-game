import React, { useEffect, useState } from "react";
import s from "@/styles/Board.module.scss";
import WhiteRook from "./whiteShapes/WhiteRook";
import WhiteBishop from "./whiteShapes/WhiteBishop";
import WhiteQueen from "./whiteShapes/WhiteQueen";
import WhiteKing from "./whiteShapes/WhiteKing";
import WhiteHorse from "./whiteShapes/WhiteHorse";
import WhitePawn from "./whiteShapes/WhitePawn";
import BlackRook from "./blackShapes/BlackRook";
import BlackHorse from "./blackShapes/BlackHorse";
import BlackQueen from "./blackShapes/BlackQueen";
import BlackKing from "./blackShapes/BlackKing";
import BlackPawn from "./blackShapes/BlackPawn";
import BlackBishop from "./blackShapes/BlackBishop";

export default function Board() {
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const size = 8;
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];

  function handlePieceClick(position) {
    if (selectedPiece && possibleMoves.includes(position)) {
      makeMove(position);
    } else {
      const piece = positions[position];
      if (piece) {
        const color =
          position.includes("2") || position.includes("1") ? "white" : "black";
        selectPiece(position, color);
      }
    }
  }

  function getPawnMoves(position, color) {
    const [letter, number] = position.split("");
    const row = parseInt(number, 10);
    const column = letter.charCodeAt(0) - "a".charCodeAt(0);

    const direction = color === "white" ? 1 : -1;

    const startingRow = color === "white" ? 2 : 7;

    let moves = [];
    moves.push(
      String.fromCharCode(column + "a".charCodeAt(0)) + (row + direction)
    );
    if (row === startingRow) {
      moves.push(
        String.fromCharCode(column + "a".charCodeAt(0)) + (row + direction * 2)
      );
    }

    return moves;
  }

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const initialPositions = {};

    // Расстановка белых фигур
    "RNBQKBNR".split("").forEach((piece, i) => {
      initialPositions[`${letters[i]}1`] = getPieceComponent(
        piece,
        "white",
        `${letters[i]}1`
      );
    });

    // Расстановка белых пешек
    letters.forEach((letter, i) => {
      initialPositions[`${letter}2`] = (
        <WhitePawn onClick={() => handlePieceClick(`${letter}2`, "white")} />
      );
    });

    // Расстановка черных фигур
    "RNBQKBNR".split("").forEach((piece, i) => {
      initialPositions[`${letters[i]}8`] = getPieceComponent(
        piece,
        "black",
        `${letters[i]}8`
      );
    });

    // Расстановка черных пешек
    letters.forEach((letter, i) => {
      initialPositions[`${letter}7`] = (
        <BlackPawn onClick={() => handlePieceClick(`${letter}7`, "black")} />
      );
    });

    setPositions(initialPositions);
  }, []);

  function getPieceComponent(piece, color, position) {
    const pieceComponents = {
      R:
        color === "white" ? (
          <WhiteRook onClick={() => handlePieceClick(position, color)} />
        ) : (
          <BlackRook onClick={() => handlePieceClick(position, color)} />
        ),
      N:
        color === "white" ? (
          <WhiteHorse onClick={() => handlePieceClick(position, color)} />
        ) : (
          <BlackHorse onClick={() => handlePieceClick(position, color)} />
        ),
      B:
        color === "white" ? (
          <WhiteBishop onClick={() => handlePieceClick(position, color)} />
        ) : (
          <BlackBishop onClick={() => handlePieceClick(position, color)} />
        ),
      Q:
        color === "white" ? (
          <WhiteQueen onClick={() => handlePieceClick(position, color)} />
        ) : (
          <BlackQueen onClick={() => handlePieceClick(position, color)} />
        ),
      K:
        color === "white" ? (
          <WhiteKing onClick={() => handlePieceClick(position, color)} />
        ) : (
          <BlackKing onClick={() => handlePieceClick(position, color)} />
        ),
    };
    return pieceComponents[piece] || null;
  }

  function selectPiece(position, color) {
    console.log("Selecting piece:", position, color);

    if (color !== currentPlayer) {
      console.log("Not your turn!");
      return;
    }

    const moves = getPawnMoves(position, color);
    setSelectedPiece(position);
    setPossibleMoves(moves);
  }

  function makeMove(toPosition) {
    if (possibleMoves.includes(toPosition) && selectedPiece) {
      setPositions((prevPositions) => {
        const newPositions = { ...prevPositions };

        // Получаем компонент фигуры, которую перемещаем
        const pieceComponent = React.cloneElement(
          prevPositions[selectedPiece],
          { onClick: () => handlePieceClick(toPosition, currentPlayer) }
        );

        delete newPositions[selectedPiece]; // Удаляем фигуру со старой позиции
        newPositions[toPosition] = pieceComponent; // Добавляем фигуру на новую позицию

        return newPositions;
      });

      setSelectedPiece(null);
      setPossibleMoves([]);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    }
  }

  function isLight(row, col) {
    return (row + col) % 2 === 0;
  }

  return (
    <div className={s.boardWrapper}>
      <div className={s.rowLabels}>
        {numbers
          .slice(0)
          .reverse()
          .map((number) => (
            <div key={number} className={s.label}>
              {number}
            </div>
          ))}
      </div>
      <div className={s.board}>
        {Array.from({ length: size * size }, (_, index) => {
          const row = Math.floor(index / size) + 1;
          const col = index % size;
          const position = `${letters[col]}${numbers[8 - row]}`;
          const piece = positions[position];

          return (
            <div
              key={position}
              className={`${s.cell} ${
                isLight(row, col) ? s.lightSquare : s.darkSquare
              }`}
              onClick={() => handlePieceClick(position)}
            >
              {piece}
            </div>
          );
        })}
      </div>

      <div className={s.columnLabels}>
        {letters.map((letter) => (
          <div key={letter} className={s.label}>
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
