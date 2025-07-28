export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search efforts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 rounded-sm p-1 w-200 h-fit">

    </input>
  );
}
