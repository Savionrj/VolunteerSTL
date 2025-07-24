import NavMenu from './NavMenu';
import SearchBar from './SearchBar';


export default function Header() {
  return (
    <div className='flex justify-between items-center bg-white p-3 shadow-md h-24'>

      <h1 className='text-3xl font-bold text-[#1F1D8F]'>VOLUNTEER STL</h1>

      <SearchBar />
      <NavMenu />

    </div>
  );
}
