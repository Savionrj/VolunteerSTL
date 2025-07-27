import SearchBar from "./SearchBar";

export default function EffortFilterSection() {
  return (
    <div className="flex flex-col mt-6 pb-6 border-b border-gray-300">
      <div className="flex justify-around items-center text-3xl ">
        <h2>Efforts</h2>
        <h2>My Efforts</h2>
        <h2>Connections</h2>
        < SearchBar />
      </div>
      <div className="flex justify-between items-center mt-8 text-gray-500 text-md px-15">
        <select name="sort" id="sort" className="border border-gray-300 rounded-sm p-1 w-40 h-fit">
          <option value="best">Best</option>
          <option value="popular">Popular</option>
          <option value="recent">Recent</option>
        </select>
        <h3>Donation Efforts</h3>
      </div>
    </div>
  );
}
