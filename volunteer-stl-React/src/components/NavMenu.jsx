import { FaRegUserCircle, FaPlus } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { IoIosSettings } from "react-icons/io";




export default function NavMenu() {

  return (
      <ul className='flex'>
        <li className='p-4 text-3xl'><FaPlus /></li>
        <li className='p-4 text-3xl'><IoIosSettings /></li>
        <li className='p-4 text-3xl'><LuMessageCircleMore /></li>
        <li className='p-4 text-3xl'><FaRegUserCircle /></li>
      </ul>
  )
}
