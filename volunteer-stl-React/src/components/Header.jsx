import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';


export default function Header({ user }) {
  return (
    <div className='flex justify-between items-center bg-white p-3 shadow-md h-24'>

      <Link to="/" className='text-3xl font-bold text-[#1F1D8F]'>VOLUNTEER STL </Link>

      <NavMenu user={user} />

    </div>
  );
}
