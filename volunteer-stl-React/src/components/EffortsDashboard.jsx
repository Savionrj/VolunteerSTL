import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import filterEfforts from "../filterEfforts";

export default function EffortsDashboard({ allEfforts, user }) {

  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('Efforts');
  const [myEfforts, setMyEfforts] = useState([]);
  const [sortType, setSortType] = useState([]);

  const [connections, setConnections] = useState([]);
  const [connectionEfforts, setConnectionEfforts] = useState({});

  useEffect(() => {
    const myEffortsCall = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user-efforts/my-efforts/${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMyEfforts(data);
      } catch (err) {
        console.error('Failed to fetch my efforts:', err.message);
      }
    };
    myEffortsCall();
  }, [])

  let filteredEfforts;

  if (filterOption === 'Efforts') {
    filteredEfforts = filterEfforts(allEfforts, search);
  } else if (filterOption === 'My Efforts') {
    filteredEfforts = filterEfforts(myEfforts, search);
  }

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch(`http://localhost:8080/connections/accepted?userId=${user.id}`);
        const data = await res.json();
        setConnections(data); // each item has .id, .firstName, etc.
      } catch (err) {
        console.error("Failed to load accepted connections:", err.message);
      }
    };
    if (filterOption === "Connects") {
      fetchConnections();
    }
  }, [filterOption]);


  useEffect(() => {
    const fetchEffortsForConnections = async () => {
      const allEfforts = {};

      await Promise.all(connections.map(async (conn) => {
        try {
          const res = await fetch(`http://localhost:8080/user-efforts/get-organized-efforts?userId=${conn.id}`);
          const efforts = await res.json();
          allEfforts[conn.id] = efforts;
        } catch (err) {
          console.error(`Failed to fetch efforts for ${conn.firstName}:`, err.message);
        }
      }));

      setConnectionEfforts(allEfforts);
    };

    if (connections.length > 0 && filterOption === "Connects") {
      fetchEffortsForConnections();
    }
  }, [connections, filterOption]);

  return (
    <div>
      < EffortFilterSection setFilterOption={setFilterOption} search={search} setSearch={setSearch} setSortType={setSortType} />

      <div className="grid grid-cols-3 ">
        {filterOption === "Efforts" && (filteredEfforts.length > 0 ? (
          filteredEfforts.map((effort) => (
            <EffortCard key={effort.id || effort.effortId} effort={effort} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 pt-15">No efforts to show.</p>
        ))}

        {filterOption === "My Efforts" && (filteredEfforts.length > 0 ? (
          filteredEfforts.map((effort) => (
            <EffortCard key={effort.id || effort.effortId} effort={effort} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 pt-15">You have no efforts to show.</p>
        ))}

        {filterOption === "Connects" && (
          <div className="space-y-12 mt-10">
            {connections.length > 0 ? (
              connections.map((conn) => (
                <div key={conn.id} className="w-[100vw]">

                  <Link to={`account/${conn.id}`} className="flex items-center gap-4 px-12">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg uppercase">
                      {conn.firstName[0]}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {conn.firstName} {conn.lastName}
                    </h2>
                  </Link>


                  {(connectionEfforts[conn.id]?.length > 0) ? (
                    <div className="flex overflow-x-auto px-2">
                      {connectionEfforts[conn.id].map((effort) => (
                        <div
                          key={effort.id || effort.effortId}
                          className="flex-shrink-0"
                        >
                          <EffortCard effort={effort} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic px-2 ml-12">No efforts from this user.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-lg">No connections to show.</p>
            )}
          </div>
        )}




      </div>
    </div>
  );
}
