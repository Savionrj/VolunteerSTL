import { FaRegUserCircle, FaPlus } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosSettings, IoIosNotifications } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";


import { Link } from "react-router-dom";

export default function NavMenu({ user, hasNotifications, setSidebarOpen, sidebarOpen }) {

  return (
    <ul className='flex text-white'>
      <Link to='about' className='hover:text-[#f7f49e] p-4 text-3xl'><FaCircleInfo /></Link>
      <Link to='notifications' className={`${hasNotifications ? 'text-red-700' : ''} hover:text-[#f7f49e] p-4 text-3xl`}><IoIosNotifications /></Link>
      <Link to='add-effort' className='hover:text-[#f7f49e] p-4 text-3xl'><FaPlus /></Link>
      <Link to='settings' className='hover:text-[#f7f49e] p-4 text-3xl'><IoIosSettings /></Link>
      <Link to={`/account/${user.id}`} className='hover:text-[#f7f49e] p-4 text-3xl'><FaRegUserCircle /></Link>
    </ul>
  )
}
