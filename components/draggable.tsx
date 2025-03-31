"use client";

import React, { ReactNode, useCallback, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { HoverInfo } from "./context";

type DraggableProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  id: string;
  updateHoverInfo: (newInfo: HoverInfo) => void;
};

function Draggable({ children, id, updateHoverInfo }: DraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    over,
    isDragging,
    node,
  } = useDraggable({
    id: id,
  });

  const mouseBeMovin = useCallback(
    (event: MouseEvent) => {
      if (over && over.id != id) {
        let above = event.clientY < over.rect.top + over.rect.height / 2;
        updateHoverInfo({
          overId: over.id as string,
          draggableId: id,
          above: above,
        });
      }

      event.stopPropagation();
      event.preventDefault();
    },
    [over]
  );

  useEffect(() => {
    if (isDragging) {
      node.current?.addEventListener("mousemove", mouseBeMovin);
    } else {
      node.current?.removeEventListener("mousemove", mouseBeMovin);
    }

    return () => {
      node.current?.removeEventListener("mousemove", mouseBeMovin);
    };
  }, [isDragging, mouseBeMovin]);

  const style: React.CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="bg-amber-200 rounded-xl border-4 border-amber-500 h-12 flex align-middle items-center w-44 font-semibold flex-row justify-center text-amber-700">
        {children}
      </div>
    </button>
  );
}

export default Draggable;
