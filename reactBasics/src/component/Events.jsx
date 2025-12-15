import React, {useRef} from "react";
import {minutesToTimeString} from "src/utils";
import {isOverLapping} from "../utils";

const Events = ({events, setEvents}) => {
  const dragRef = useRef(null); // holds { id, startY, initialStart, initialEnd, newStart, newEnd }
  const initialRef = useRef(null); // holds original { id, originalStart, originalEnd }

  // mouse down: initialize refs and listeners
  const handleMouseDown = (e, event) => {
    dragRef.current = {
      id: event.id,
      startY: e.clientY,
      initialStart: event.start,
      initialEnd: event.end,
      newStart: event.start,
      newEnd: event.end,
    };

    // store original values so we can revert if needed
    initialRef.current = {
      id: event.id,
      originalStart: event.start,
      originalEnd: event.end,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  let rafId = null;
  const handleMouseMove = (e) => {
    if (!dragRef.current) return;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const {id, startY, initialStart, initialEnd} = dragRef.current;
      const deltaY = e.clientY - startY;

      const newStart = Math.max(0, Math.round(initialStart + deltaY));
      const duration = initialEnd - initialStart;

      const newEnd = newStart + duration;

      // store new values on ref so mouseUp can access them
      dragRef.current.newStart = newStart;
      dragRef.current.newEnd = newEnd;

      // update UI (immutable)
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id
            ? {
                ...ev,
                start: newStart,
                end: newEnd,
              }
            : ev,
        ),
      );
    });
  };

  const handleMouseUp = () => {
    if (!dragRef.current || !initialRef.current) {
      cleanup();
      return;
    }

    const {id} = dragRef.current;
    const newStart = dragRef.current.newStart ?? dragRef.current.initialStart;
    const newEnd = dragRef.current.newEnd ?? dragRef.current.initialEnd;

    // check overlap with OTHER events against the new position
    const overlapping = events.some(
      (e) => e.id !== id && isOverLapping(e, {start: newStart, end: newEnd}),
    );

    if (overlapping) {
      // revert to original position (from initialRef)
      const {originalStart, originalEnd} = initialRef.current;
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id
            ? {
                ...ev,
                start: originalStart,
                end: originalEnd,
              }
            : ev,
        ),
      );
    } else {
      // ensure final state is the dragged position (already set during move, but set again to be safe)
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id
            ? {
                ...ev,
                start: newStart,
                end: newEnd,
              }
            : ev,
        ),
      );
    }

    cleanup();
  };

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    dragRef.current = null;
    initialRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {events?.map((event) => {
        const top = event.start;
        const height = Math.max(1, event.end - event.start); // avoid zero/neg heights
        return (
          <div
            key={event.id}
            style={{
              top: `${top}px`,
              left: "20px",
              height: `${height}px`,
              position: "absolute",
              width: "75%",
            }}
            className="bg-blue-400 z-10 rounded flex flex-col justify-center p-1 shadow-lg"
            onMouseDown={(e) => handleMouseDown(e, event)}
          >
            <div>{event.title}</div>
            <div>
              {minutesToTimeString(event.start)} -{" "}
              {minutesToTimeString(event.end)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Events;
