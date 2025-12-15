import React from "react";
import {minutesToTimeString, timeToMinutes} from "src/utils";

const EventModal = ({time, onClose, onSubmit}) => {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // Clean up when modal is unmounted
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleForm = (formData) => {
    const title = formData.get("title");
    const start = formData.get("start");
    const end = formData.get("end");
    if (!title || !start || !end) return;

    onSubmit({
      id: Date.now(),
      start: timeToMinutes(start),
      end: timeToMinutes(end),
      title,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center z-20 justify-center bg-black/50">
      <div className="bg-white p-4 rounded-xl shadow-md w-80">
        <h3 className="font-bold text-lg mb-2">Create Event</h3>

        <form action={handleForm} className="flex flex-col gap-2">
          <div>
            <label className="label" htmlFor="title">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              className="input"
              placeholder="Enter Title"
            />
          </div>
          <div>
            <label className="label" htmlFor="start">
              Start time
            </label>
            <input
              type="time"
              className="input"
              name="start"
              defaultValue={minutesToTimeString(time)}
            />
          </div>
          <div>
            <label className="label" htmlFor="End">
              End time
            </label>
            <input type="time" className="input" name="end" />
          </div>
          <input type="submit" className="input" value="create" />
        </form>
      </div>
    </div>
  );
};

export default EventModal;
