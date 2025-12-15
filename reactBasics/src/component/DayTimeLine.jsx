import {useState} from "react";
import EventModal from "src/component/EventModal";
import Events from "src/component/Events";

const hours = [...Array(24).keys()];

const DayTimeLine = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1763699078220,
      start: 280,
      end: 357,
      title: "adfaf",
    },
    {
      id: 1763699090930,
      start: 430,
      end: 598,
      title: "aefeafawe",
    },
  ]);

  const handleClick = (e, h) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const isFirstHalf = clickY < rect.height / 2; // px → time
    let time = h * 60;
    if (!isFirstHalf) {
      time += 30;
    }
    setSelectedTime(time);
  };

  return (
    <div className="relative">
      {!!events.length && <Events events={events} setEvents={setEvents} />}
      <div className="relative w-full">
        {hours.map((h) => (
          <div
            key={h}
            className="h-[60px] border-b px-2 text-sm flex items-center"
            onClick={(e) => handleClick(e, h)}
          >
            {h === 0
              ? "12 AM"
              : h < 12
              ? `${h} AM`
              : h === 12
              ? "12 PM"
              : `${h - 12} PM`}
          </div>
        ))}

        {selectedTime && (
          <EventModal
            time={selectedTime}
            onClose={() => setSelectedTime(null)}
            onSubmit={(event) => {
              setEvents((prev) => [...prev, event]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DayTimeLine;
