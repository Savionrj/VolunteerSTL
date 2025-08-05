export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search efforts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-md p-1 w-[30vw] h-fit bg-white focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition sm:w-[20vw] md:w-[30vw] lg:w-[40vw]">

    </input>
  );
}
