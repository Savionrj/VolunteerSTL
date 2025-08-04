import { useEffect, useState, useRef } from "react";
import { FaUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EffortCard from "./EffortCard";

export default function ConnectionsPage({ user }) {
  const [connections, setConnections] = useState([]);

  return (
    <div className="px-10 py-6">
      <h1 className="text-3xl font-bold mb-8">Connections</h1>

      {connections.map((connection) => (
        <ConnectionEfforts key={connection.id} connection={connection} />
      ))}
    </div>
  );
}

function ConnectionEfforts({ connection }) {
  const [efforts, setEfforts] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchEfforts = async () => {
      try {
        const res = await fetch(`http://localhost:8080/user-efforts/get-organized-efforts?userId=${connection.id}`);
        const data = await res.json();
        setEfforts(data);
      } catch (err) {
        console.error("Error fetching efforts:", err.message);
      }
    };
    fetchEfforts();
  }, [connection]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <FaUserCircle className="text-2xl" />
        <h2 className="text-xl font-semibold">{connection.firstName}</h2>
      </div>

      <div className="relative">
        {efforts.length > 3 && (
          <div className="absolute -left-6 top-1/3 z-10">
            <button onClick={scrollLeft}><FaChevronLeft /></button>
          </div>
        )}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide pr-4"
        >
          {efforts.map((effort) => (
            <div key={effort.id} className="min-w-[250px] flex-shrink-0">
              <EffortCard effort={effort} />
            </div>
          ))}
        </div>
        {efforts.length > 3 && (
          <div className="absolute -right-6 top-1/3 z-10">
            <button onClick={scrollRight}><FaChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}
