import volunteerImage from '../images/volunteer.jpg';
import { FaRegUserCircle, FaPlus } from "react-icons/fa";

export default function AccountPage() {

  return (
    <div className='flex w-full justify-between p-6'>
      <div className='flex flex-col border border-gray-500 rounded-md p-10 h-full'>
        <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="h-58 w-58 object-cover rounded-full" />
        <div className='flex justify-between items-center my-8'>
          <h5><span className='text-2xl'>Savion</span><br />@savionrj</h5>
          <FaPlus />
        </div>
        <h6 className='font-bold'>Message Me</h6>
        <div className='my-8'>
          <p>Participated in <span className='font-bold'>3</span> Efforts</p>
          <p>Organized <span className='font-bold'>1</span> Effort</p>
        </div>
      </div>
      <div className='text-3xl'>
        <h4>Bio</h4>
        <h4>Effort History</h4>
        <h4>Efforts I Created</h4>
      </div>
    </div>
  )
}
