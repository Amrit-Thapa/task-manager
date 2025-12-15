import {useState} from "react";
import {timeToMinutes} from "src/utils";

const EventCreation = () => {
  const [events, setEvents] = useState({});
  const [currentDay, setCurrentDay] = useState();

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

export default EventCreation;
