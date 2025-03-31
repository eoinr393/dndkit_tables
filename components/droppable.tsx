"use client";

import { useDroppable } from "@dnd-kit/core";
import React, { ReactNode, useRef } from "react";

type DroppableProps = {
  id: string;
  children: ReactNode;
  hasElement: boolean;
};

export default function Droppable({
  id,
  children,
  hasElement = false,
}: DroppableProps) {
  const { isOver, setNodeRef, rect } = useDroppable({
    id,
  });

  const myRef = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {
    color: isOver && !children ? "green" : undefined,
  };

  const classes = `h-12 ${
    hasElement ? "bg-gray-500" : "bg-gray-400"
  } border-gray-400 border-2 text-center`;
  return (
    <div ref={setNodeRef} style={style} className={classes}>
      <div ref={myRef}>
        {children}
      </div>
    </div>
  );
}
