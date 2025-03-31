"use client";

import Draggable from "@/components/draggable";
import Droppable from "@/components/droppable";
import { DndContext } from "@dnd-kit/core";
import { act, JSX, useEffect, useMemo, useState } from "react";

type DroppableData = {
  elementId: string | undefined;
  id: string;
};

type DraggableData = {
  elementId: string;
};

export type HoverInfo = {
  overId: string;
  draggableId: string;
  above: boolean;
};

export default function Conext() {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | undefined>();

  function getDraggable(id: string) {
    return (
      <Draggable id={`${id}`} updateHoverInfo={updateHoverInfo}>
        {id}
      </Draggable>
    );
  }

  const [initialContainers, setContainers] = useState<DroppableData[]>([
    { id: "container_1", elementId: "draggable_1" },
    { id: "container_2", elementId: "draggable_2" },
    { id: "container_3", elementId: "draggable_3" },
  ]);

  const [draggables, setDraggables] = useState<DraggableData[]>([
    {
      elementId: "draggable_4",
    },
    {
      elementId: "draggable_5",
    },
  ]);

  function updateHoverInfo(newInfo: HoverInfo) {
    if (
      newInfo.overId != `container_${initialContainers.length + 1}` &&
      (!hoverInfo || JSON.stringify(newInfo) != JSON.stringify(hoverInfo))
    ) {
      setHoverInfo(newInfo);
    }
  }

  const containers = useMemo(() => {
    if (!hoverInfo?.overId) {
      return initialContainers;
    }

    let overContainer = initialContainers.find(
      (x) => x.id === hoverInfo.overId
    );
    if (!overContainer) {
      return initialContainers;
    }

    let overIndex = initialContainers.indexOf(overContainer);
    let belowElementIsCurrentDraggable =
      overIndex < initialContainers.length - 1 &&
      !hoverInfo.above &&
      hoverInfo.draggableId == `${initialContainers[overIndex + 1].elementId}`;
    let aboveElementIsCurrentDraggable =
      overIndex > 0 &&
      hoverInfo.above &&
      hoverInfo.draggableId == `${initialContainers[overIndex - 1].elementId}`;

    if (belowElementIsCurrentDraggable || aboveElementIsCurrentDraggable) {
      return initialContainers;
    }

    let containersTemp: DroppableData[] = [];

    for (let i = 0; i < initialContainers.length; i++) {
      if (!hoverInfo.above) {
        containersTemp.push(initialContainers[i]);
      }

      if (
        hoverInfo.overId === initialContainers[i].id &&
        hoverInfo.draggableId != `${initialContainers[i].elementId}`
      ) {
        containersTemp.push({
          id: `container_${initialContainers.length + 1}`,
          elementId: undefined,
        });
      }

      if (hoverInfo.above) {
        containersTemp.push(initialContainers[i]);
      }
    }

    return containersTemp;
  }, [hoverInfo, initialContainers]);

  return (
    <div>
      over: {JSON.stringify(hoverInfo)}
      <br />
      initial containers: {JSON.stringify(initialContainers)}
      <br />
      containers: {JSON.stringify(containers)}
      <div className="flex flex-row gap-x-4 w-full h-full items-center align-middle justify-center">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="w-1/5 bg-white text-black p-8 inline">
            {draggables.map((d, i) => (
              <div key={i}>{<div>{getDraggable(d.elementId)}</div>}</div>
            ))}
          </div>
          <div className="w-1/5">
            {containers.map((drop, i) => (
              <div key={i}>
                <Droppable
                  id={drop.id}
                  hasElement={drop.elementId ? true : false}
                >
                  {drop.elementId && getDraggable(drop.elementId)}
                </Droppable>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    console.log(event);
    if (!over) {
      console.log("Not dropped over a valid container");
      setHoverInfo(undefined)
      return;
    }
    let overContainer = containers.find((x) => x.id === over.id);

    if (!overContainer || overContainer.elementId) {
      setHoverInfo(undefined)
      return;
    }

    //remove dropped draggable from floating list
    if (draggables.some((x) => x.elementId === active.id)) {
      setDraggables(draggables.filter((x) => x.elementId != active.id));
    }

    //add to
    let newContainers: DroppableData[] = [];
    let containerIndex = 1;
    for (let i = 0; i < containers.length; i++) {
      //if we moved an existing draggable in the context to a new spot, this spot is empty so remove
      if (containers[i].elementId == active.id && over.id != containers[i].id) {
        continue;
      }

      newContainers.push({
        elementId:
          overContainer.id == containers[i].id
            ? active.id
            : containers[i].elementId,
        id: `container_${containerIndex}`,
      });

      containerIndex++;
    }

    setContainers(newContainers);
  }
}
