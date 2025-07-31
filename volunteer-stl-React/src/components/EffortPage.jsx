import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import volunteerImage from '../images/volunteer.jpg';

export default function EffortPage({ efforts, user }) {

  const { effortId } = useParams();
  const [registered, setRegistered] = useState(false);
  const [userEffortCount, setUserEffortCount] = useState(0);

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );

  if (currentEffort) {
    const userEffort = {
      userId: user.id,
      effortId: currentEffort.effortId
    };

    const fetchCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user-efforts/get-count-of-user-efforts-by-effort/${effortId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserEffortCount(data);
      } catch (err) {
        console.error('Failed to fetch effort volunteer count:', err.message);
      }
    };

    const setRegisterState = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user-efforts/get-user-effort-by-user-and-effort?userId=${user.id}&effortId=${currentEffort.effortId}`);
        if (!response.ok) {
          setRegistered(false);
          return;
        }
        const text = await response.text();
        setRegistered(text === 'true');
      } catch (err) {
      }
    };

    useEffect(() => {
      fetchCount();
      setRegisterState();
    }, [user, currentEffort, setRegisterState]);

    const handleRegister = async (e) => {

      if (!registered) {

        try {
          const response = await fetch('http://localhost:8080/user-efforts/register-for-effort', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userEffort)

          });

          if (response.ok) {
            fetchCount();
            setRegisterState();
          }

          else if (response.status === 404) {
            console.error("User not found.");
          }
          else if (response.status === 409) {
            console.error("User already registered for this effort.");
          } else {
            console.error("Registration failed");
          }
        } catch (error) {
          console.error("Error during effort registration:", error);
        }
      }

      else {
        try {
          const response = await fetch(`http://localhost:8080/user-efforts/unregister?userId=${user.id}&effortId=${currentEffort.effortId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            fetchCount();
            setRegisterState();
          } else {
            console.error("Unregistration failed.");
          }
        } catch (error) {
          console.error("Error during unregistration:", error);
        }
      }
    };

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

    return (
      <div>
        <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
          <h3>
            <span className="text-3xl">{currentEffort.effortName}</span>
            <br />
            <span className="text-2xl">By {currentEffort.organizerName}</span>
          </h3>
          <button type="button" className="border border-gray-300 rounded-md p-2 text-2xl" onClick={(e) => handleRegister(e)} disabled={userEffortCount >= currentEffort.maxVolunteers && !registered}>
            {registered ? "Unregister" : "Register"}
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
              <p>Volunteer Count: {userEffortCount} / {currentEffort.maxVolunteers} </p>
            </div>
          </div>

          <div className="p-8 text-2xl">
            <h4>Description</h4>
            <p>{currentEffort.description}</p>
          </div>

          <div /*TODO - create comment section after setting up endpoints for effort comments*/>
          </div>
        </div>
      </div>
    )
  }
}
