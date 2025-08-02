import { useState, useEffect } from 'react';
import volunteerImage from '../images/volunteer.jpg';
import { FaRegUserCircle, FaPlus } from "react-icons/fa";

export default function AccountPage({ user }) {

  const [completedCount, setCompletedCount] = useState();
  const [organizedCount, setOrganizedCount] = useState();

  const getCompletedCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user-efforts/count-completed-efforts?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompletedCount(data);
    } catch (err) {
      console.error('Failed to fetch completed effort count:', err.message);
    }
  };

  const getOrganizedCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user-efforts/count-organized-efforts?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrganizedCount(data);
    } catch (err) {
      console.error('Failed to fetch completed effort count:', err.message);
    }
  };

  useEffect(() => {
    getCompletedCount();
    getOrganizedCount();
  }, []);

  return (
    <div className='flex w-full justify-between p-6 items-center'>
      <div className='flex flex-col border border-gray-500 rounded-md p-10 h-full'>
        <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="h-58 w-58 object-cover rounded-full" />
        <div className='flex justify-between items-center my-8'>
          <h5><span className='text-2xl'>{user.firstName}</span><br />@{user.username}</h5>
          <FaPlus />
        </div>
        <h6 className='font-bold'>Message Me</h6>
        <div className='my-8'>
          {completedCount ? (<p>Efforts Completed: <span className='font-bold'>{completedCount}</span></p>) : (<p>No Completed Efforts</p>)}
          {organizedCount ? (<p>Efforts Organized <span className='font-bold'>{organizedCount}</span></p>) : (<p>No Organized Efforts</p>)}
          
        </div>
      </div>
      <div className='text-3xl'>
        <h4>Bio</h4>
        <p>{user.bio}</p>
        <h4>Effort History</h4>
        <p></p>
        <h4>Efforts I Created</h4>
        <p></p>
      </div>
    </div>
  )
}
