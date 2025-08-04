import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import filterEfforts from "../filterEfforts";
import { LuMessageCircleMore } from "react-icons/lu";

export default function EffortsDashboard({ allEfforts, user, sidebarOpen, conversations, setSidebarOpen }) {

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
        setConnections(data);
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

  const toggleMessageMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
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

                      <img className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg uppercase" src={`http://localhost:8080${conn.profilePictureUrl}`} />


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
                      <p className="text-gray-500 italic px-2 ml-12 mb-20">No efforts from this user.</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">No connections to show.</p>
              )}
            </div>
          )}




        </div>

        <button onClick={toggleMessageMenu} className='fixed bottom-4 right-4 border rounded-full shadow-2xl p-4 text-3xl bg-white z-50'><LuMessageCircleMore /></button>
      </div>
      {
        sidebarOpen && (
          <div className="fixed inset-0 z-50">

            <div
              className="absolute inset-0"
              onClick={() => setSidebarOpen(false)}
            />


            <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 text-2xl hover:text-gray-800 transition"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>


              <div className="flex-1 overflow-y-auto space-y-4">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <Link
                      key={conv.id}
                      to="/message"
                      state={{ receiver: conv }}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
                    >
                      <img src={`http://localhost:8080${conv.profilePictureUrl}`} className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center" />

                      <span className="text-gray-800 font-medium">
                        {conv.firstName} {conv.lastName}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No conversations yet.</p>
                )}
              </div>
            </div>
          </div>

        )
      }
    </>
  );
}
