import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import volunteerImage from '../images/volunteer.jpg';
import { FaPlus } from "react-icons/fa";
import EffortCard from './EffortCard';
import Button from './Button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AccountPage({ user }) {

  const { userId } = useParams();
  const [connectionStatus, setConnectionStatus] = useState();
  const [currUser, setCurrUser] = useState();
  const nav = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});


  //This fetches the user whose account we're trying to access
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCurrUser(data);
      } catch (err) {
        console.error('Failed to fetch user:', err.message);
      }
    }
    getUser();
  }, [userId])

  const [completedCount, setCompletedCount] = useState();
  const [organizedCount, setOrganizedCount] = useState();
  const [organizedEfforts, setOrganizedEfforts] = useState();

  //This fetches the amount of efforts completed by a user
  const getCompletedCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user-efforts/count-completed-efforts?userId=${currUser.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompletedCount(data);
    } catch (err) {
      console.error('Failed to fetch completed effort count:', err.message);
    }
  };

  //Fetches the amount of efforts organized by a user
  const getOrganizedCount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user-efforts/count-organized-efforts?userId=${currUser.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrganizedCount(data);
    } catch (err) {
      console.error('Failed to fetch completed effort count:', err.message);
    }
  };

  //Retrieves all efforts organized by the user
  const getOrganizedEfforts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user-efforts/get-organized-efforts?userId=${currUser.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrganizedEfforts(data);
    } catch (err) {
      console.error('Failed to fetch completed effort count:', err.message);
    }
  };

  //Ensures that the stats are up to date whenever a user's page is viewed
  useEffect(() => {
    if (currUser) {
      getCompletedCount();
      getOrganizedCount();
      getOrganizedEfforts();
    }
  }, [currUser]);

  const [viewingSelf, setViewingSelf] = useState();

  //This will be used to conditionally render elements if a user is viewing their own account
  useEffect(() => {
    if (currUser && user) {
      setViewingSelf(currUser.id === user.id);
    }
  }, [currUser, user]);

  //The are for navigating a scrollable list
  const scrollRef = useRef(null);
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  //This retrieves the status of a connection, it will be used to conditionally render elements
  const checkExistingConnection = async () => {
    try {
      const response = await fetch(`http://localhost:8080/connections/already-connected?currUserId=${user.id}&viewedUserId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      setConnectionStatus(data);
    } catch (err) {
      console.error('Failed to fetch connection status:', err.message);
    }
  }

  useEffect(() => {
    checkExistingConnection();
  }, [userId]);

  //This creates a new connection request
  const handleConnectionSent = async () => {
    try {
      const response = await fetch(`http://localhost:8080/connections?senderId=${user.id}&receiverId=${userId}`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await checkExistingConnection();
    } catch (err) {
      console.error('Failed to create connection request:', err.message);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {!currUser ? (
        <div className="p-8">
          <p className="text-xl text-gray-600">Loading user profile...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10'>

          <div className='flex flex-col bg-white rounded-2xl shadow-md p-6 text-center'>
            <img src={`http://localhost:8080${currUser.profilePictureUrl}`} className="h-36 w-36 mx-auto object-cover rounded-full mb-4 border-4 border-white shadow" />
            <h2 className="text-2xl font-semibold">{currUser.firstName}</h2>
            <p className="text-gray-500">@{currUser.username}</p>

            {!viewingSelf ? (<>

              {connectionStatus == "Connection Doesn't Exist" ? (<button onClick={handleConnectionSent} className="px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2">
                <FaPlus /> Follow
              </button>) : (<></>)}

              {connectionStatus == "accepted" && <button onClick={() => nav(`/message`, { state: { receiver: currUser } })} className="mt-8 font-semibold text-lg">Message Me</button>}

              {connectionStatus == "pending" && <h3 className='text-sm text-gray-400 mt-4'>pending response...</h3>}

            </>) : (
              <Button
                clickedIt={() => {
                  setEditMode(!editMode);
                  setEditedProfile({
                    firstName: currUser.firstName,
                    lastName: currUser.lastName,
                    bio: currUser.bio || '',
                    email: currUser.email,
                    profilePictureUrl: currUser.profilePictureUrl || ''
                  });
                }}
                buttonName={'Edit Profile'}
                classname={"mt-4 p-2 border rounded-md hover:bg-gray-100 text-sm"} />
            )}


            <div className='mt-8 text-sm'>
              {completedCount ? (<p>Efforts Completed: <span className='font-bold'>{completedCount}</span></p>) : (<p>No Completed Efforts</p>)}

              {organizedCount ? (<p>Efforts Organized <span className='font-bold'>{organizedCount}</span></p>) : (<p>No Organized Efforts</p>)}
            </div>
          </div>


          <div className='flex-1 overflow-hidden'>
            <section className="mb-8">

              {editMode ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const formData = new FormData();


                      const { newImageFile, ...sanitizedProfile } = editedProfile;

                      formData.append("user", new Blob([JSON.stringify(sanitizedProfile)], { type: 'application/json' }));
                      if (newImageFile) {
                        formData.append("image", newImageFile);
                      }



                      const response = await fetch(`http://localhost:8080/users/${currUser.id}/profile`, {
                        method: 'PUT',
                        body: formData
                      });

                      if (!response.ok) throw new Error('Update failed');
                      const updatedUser = await response.json();
                      setCurrUser(updatedUser);
                      setEditMode(false);
                    } catch (err) {
                      console.error('Profile update failed:', err.message);
                    }
                  }
                  }
                  className="space-y-4"
                >
                  {["firstName", "lastName", "email", "bio"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium capitalize focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition">{field.replace(/([A-Z])/g, ' $1')}</label>
                      {field === "bio" ? (
                        <textarea
                          rows={3}
                          value={editedProfile[field]}
                          onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedProfile[field]}
                          onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
                        />
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium">Upload Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditedProfile(prev => ({ ...prev, newImageFile: file }));
                      }}
                      className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
                    />
                  </div>


                  <div className="flex gap-2">


                    <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">Save</button>


                    <button type="button" onClick={() => setEditMode(false)} className="text-gray-600 underline">Cancel</button>


                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-2">Bio</h3>
                  <p className="text-gray-700 text-base leading-relaxed">{currUser.bio || "No bio provided."}</p>
                </>
              )}


            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Efforts {currUser.firstName} Created</h3>

                {organizedEfforts?.length > 3 && (
                  <div className="flex gap-2">
                    <button onClick={scrollLeft} className="p-2 rounded-full hover:bg-gray-200">
                      <FaChevronLeft />
                    </button>
                    <button onClick={scrollRight} className="p-2 rounded-full hover:bg-gray-200">
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>

              {organizedEfforts?.length > 0 ? (
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4"
                >
                  {organizedEfforts.map((effort) => (
                    <div key={effort.id || effort.effortId}
                      className="flex-shrink-0 rounded-md w-[400px] h-[400px] ">
                      <EffortCard effort={effort} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-gray-500">{currUser.firstName} hasn't created any efforts.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
