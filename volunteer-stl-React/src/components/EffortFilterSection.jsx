import SearchBar from "./SearchBar";

export default function EffortFilterSection({ setFilterOption, search, setSearch, setSortType }) {


  return (
    <div className="flex flex-col py-6 border-b border-gray-300 bg-[#ECECEC]">
      <div className="flex justify-around items-center text-3xl">
        <button className="hover:text-[#D4B82F] transition" onClick={() => setFilterOption('Efforts')}>Efforts</button>
        <button className="hover:text-[#D4B82F] transition" onClick={() => setFilterOption('My Efforts')}>My Efforts</button>
        <button className="hover:text-[#D4B82F] transition" onClick={() => setFilterOption('Connects')}>Connections</button>
        < SearchBar search={search} setSearch={setSearch} />
      </div>
    </div>
  );
}
