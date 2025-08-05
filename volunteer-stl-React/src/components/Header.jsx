import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';


export default function Header({ user, hasNotifications, setSidebarOpen, sidebarOpen }) {
  return (
    <div className='flex justify-between items-center p-3 shadow-md h-24 bg-[#162c64]'>

      <Link to="/" className='text-3xl font-bold text-white'>VOLUNTEER STL </Link>

      <NavMenu user={user} hasNotifications={hasNotifications} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

    </div>
  );
}
