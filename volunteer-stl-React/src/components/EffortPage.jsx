import { useParams } from "react-router-dom"
import { useState } from "react";
import volunteerImage from '../images/volunteer.jpg';

export default function EffortPage({ efforts }) {

  const { effortId } = useParams();
  const [register, setRegister] = useState(false)

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );

  if (!currentEffort) {
    return <div>Effort not found.</div>;
  }


  const formatDate = (effortDateTime) => {
    const formattedDate = new Date(effortDateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    return formattedDate
  }

  const formatTime = (effortDateTime) => {
    const formattedTime = new Date(effortDateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })

    return formattedTime;
  }

  const handleRegister = (e) => {
    setRegister(!register);
    //Will return after I create user registration functionality
  }

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h3>
          <span className="text-3xl">{currentEffort.effortName}</span>
          <br />
          <span className="text-2xl">By {currentEffort.organizerName}</span>
        </h3>
        <button type="button" className="border border-gray-300 rounded-md p-2 text-2xl" onClick={(e) => handleRegister(e)}>
          {register ? "Unregister" : "Register"}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center p-8">
          <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="w-1/2 h-full object-cover rounded-md" />
          <div className="flex flex-col w-full text-2xl px-10">
            <h4 className="text-3xl">Details</h4>
            <p>Date: {formatDate(currentEffort.startTime)}</p>
            <p>Starting Time: {formatTime(currentEffort.startTime)} </p>
            <p>Ending Time: {formatTime(currentEffort.endTime)} </p>
            <p>Location: {currentEffort.address}
              <br />
              {currentEffort.city}, {currentEffort.state} {currentEffort.zipCode}
            </p>
            <p>Tags: {currentEffort.tags.map(tag => tag.name).join(', ')}
            </p>
            <p>Volunteer Count: {currentEffort.maxVolunteerCount} </p>
          </div>
        </div>

        <div>
        </div>

        <div>
        </div>
      </div>
    </div>
  )
}
