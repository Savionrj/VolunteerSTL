import SearchBar from "./SearchBar";

export default function EffortFilterSection({ setFilterOption, search, setSearch, setSortType }) {


  return (
    <div className="flex flex-col mt-6 pb-6 border-b border-gray-300">
      <div className="flex justify-around items-center text-3xl ">
        <button onClick={() => setFilterOption('Efforts')}>Efforts</button>
        <button onClick={() => setFilterOption('My Efforts')}>My Efforts</button>
        <button onClick={() => setFilterOption('Connects')}>Connections</button>
        < SearchBar search={search} setSearch={setSearch} />
      </div>
    </div>
  );
}
