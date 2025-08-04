import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import volunteerImage from '../images/volunteer.jpg';
import { FaPlus } from "react-icons/fa";
import EffortCard from './EffortCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AccountPage({ user }) {

  const { userId } = useParams();
  const [connectionStatus, setConnectionStatus] = useState();
  const [currUser, setCurrUser] = useState();
  const nav = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

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

  useEffect(() => {
    if (currUser) {
      getCompletedCount();
      getOrganizedCount();
      getOrganizedEfforts();
    }
  }, [currUser]);

  const [viewingSelf, setViewingSelf] = useState();

  useEffect(() => {
    if (currUser && user) {
      setViewingSelf(currUser.id === user.id);
    }
  }, [currUser, user]);

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

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
    <>

      {!currUser ? (
        <div className="p-8">
          <p className="text-xl text-gray-600">Loading user profile...</p>
        </div>
      ) : (
        <div className='flex w-full justify-between px-10 py-8 gap-10'>

          <div className='min-w-[280px] max-w-[300px] w-full border border-gray-300 rounded-md p-6 flex flex-col items-center'>
            <img src={`http://localhost:8080${currUser.profilePictureUrl}`} className="h-40 w-40 object-cover rounded-full mb-4" />
            <h2 className="text-2xl font-semibold">{currUser.firstName}</h2>
            <p className="text-gray-600">@{currUser.username}</p>

            {!viewingSelf ? (<>

              {connectionStatus == "Connection Doesn't Exist" ? (<button onClick={handleConnectionSent} className="mt-4 p-2 border rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm">
                <FaPlus /> Follow
              </button>) : (<></>)}

              {connectionStatus == "accepted" && <button onClick={() => nav(`/message`, { state: { receiver: currUser } })} className="mt-8 font-semibold text-lg">Message Me</button>}

              {connectionStatus == "pending" && <h3 className='mt-8 font-semibold text-sm'>pending response...</h3>}

            </>) : (<><button
              onClick={() => {
                setEditMode(true);
                setEditedProfile({
                  firstName: currUser.firstName,
                  lastName: currUser.lastName,
                  bio: currUser.bio || '',
                  email: currUser.email,
                  profilePictureUrl: currUser.profilePictureUrl || ''
                });
              }}
              className="mt-4 p-2 border rounded-md hover:bg-gray-100 text-sm"
            >
              Edit Profile
            </button></>)}


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
                      formData.append("user", new Blob([JSON.stringify(editedProfile)], { type: 'application/json' }));
                      if (editedProfile.newImageFile) {
                        formData.append("image", editedProfile.newImageFile);
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
                  }}
                  className="space-y-4"
                >
                  {["firstName", "lastName", "email", "profilePictureUrl", "bio"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      {field === "bio" ? (
                        <textarea
                          rows={3}
                          value={editedProfile[field]}
                          onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedProfile[field]}
                          onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
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
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>


                  <div className="flex gap-2">
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">Save</button>
                    <button type="button" onClick={() => setEditMode(false)} className="text-gray-600 underline">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-3xl font-bold">Bio</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{currUser.bio || "No bio provided."}</p>
                </>
              )}


            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold">Efforts {currUser.firstName} Created</h3>
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
                    <div key={effort.id || effort.effortId} className="min-w-[300px] flex-shrink-0">
                      <EffortCard effort={effort} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xl text-gray-500">You haven't created any efforts.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  )
}
