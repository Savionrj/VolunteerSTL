import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";
import { useState, useEffect } from "react";
import filterEfforts from "../filterEfforts";

export default function EffortsDashboard({ allEfforts, user }) {

  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('Efforts');
  const [myEfforts, setMyEfforts] = useState([]);
  const [sortType, setSortType] = useState([]);

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
            <EffortCard key={effort.id} effort={effort} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 pt-15">You have no efforts to show.</p>
        ))}

      </div>
    </div>
  );
}
