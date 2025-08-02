import { FaRegUserCircle, FaPlus } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";




export default function NavMenu({ user }) {

  return (
    <ul className='flex'>
      <li className='p-4 text-3xl'><FaPlus /></li>
      <li className='p-4 text-3xl'><IoIosSettings /></li>
      <li className='p-4 text-3xl'><LuMessageCircleMore /></li>
      <Link to={`/account/${user.id}`} className='p-4 text-3xl'><FaRegUserCircle /></Link>
    </ul>
  )
}
