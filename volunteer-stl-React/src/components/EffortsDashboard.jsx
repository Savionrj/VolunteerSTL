import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";
import { useState } from "react";

export default function EffortsDashboard({ efforts }) {

  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('Efforts');

  const filteredEfforts = efforts.filter((effort) => {
    return (
      effort.effortName.toLowerCase().includes(search.toLowerCase()) ||
      effort.address.toLowerCase().includes(search.toLowerCase())
      ||
      effort.city.toLowerCase().includes(search.toLowerCase())
      ||
      effort.state.toLowerCase().includes(search.toLowerCase())
      ||
      effort.zipCode.toLowerCase().includes(search.toLowerCase())
      ||
      effort.description.toLowerCase().includes(search.toLowerCase()) ||
      effort.organizerName.toLowerCase().includes(search.toLowerCase()) ||
      effort.tags.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div>
      < EffortFilterSection setFilterOption={setFilterOption} search={search} setSearch={setSearch} />

      <div className="grid grid-cols-3 ">
        {filterOption === "Efforts" && filteredEfforts.map((effort) =>
          <EffortCard key={effort.id} effort={effort} />
        )}

        {filterOption === 'My Efforts' && (
          <h4>My Efforts</h4>
        )}

      </div>
    </div>
  );
}
