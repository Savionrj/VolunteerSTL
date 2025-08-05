export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search efforts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-md p-1 w-1/2 h-fit bg-white focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition">

    </input>
  );
}
