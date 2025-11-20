import { useState } from "react";

const Main = () => {
  const [events, setEvents] = useState({});
  const [currentDay, setCurrentDay] = useState();

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const handleForm = (formData) => {
    const title = formData.get("title");
    const start = formData.get("start");
    const end = formData.get("end");
    const date = start.split("T");
    if (!title || !start || !end) return;

    const oldEvents = events[date[0]] || [];

    const event = [
      ...oldEvents,
      {
        id: Date.now(),
        title,
        start: timeToMinutes(date[1]),
        end: timeToMinutes(end.split("T")[1]),
      },
    ];

    setEvents((prev) => {
      return { ...prev, [date[0]]: event };
    });
  };

  return (
    <div>
      <form action={handleForm} className="flex flex-col">
        <input
          type="text"
          name="title"
          className="input"
          placeholder="Enter Title"
        />
        <input type="datetime-local" className="input" name="start" />
        <input type="datetime-local" className="input" name="end" />
        <input type="submit" className="input" value="create" />
      </form>

      <div>
        {Object.keys(events).map((day) => {
          return (
            <div key={day} onClick={() => setCurrentDay(events[day])}>
              {day}
            </div>
          );
        })}
      </div>
      <div>
        {currentDay?.map((event) => {
          return <div key={event.id}>{event.title}</div>;
        })}
      </div>
    </div>
  );
};

export default Main;
