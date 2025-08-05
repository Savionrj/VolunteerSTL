import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

export default function EffortPage({ efforts, user }) {

  const { effortId } = useParams();
  const [registered, setRegistered] = useState();
  const [userEffortCount, setUserEffortCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedEffort, setEditedEffort] = useState({});

  const nav = useNavigate();

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );


  const userEffort = currentEffort && user
    ? { userId: user.id, effortId: currentEffort.effortId }
    : null;

  const isOrganizer = user?.id === currentEffort?.userId;


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

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/effort-comments/${effortId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [effortId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/effort-comments?effortId=${effortId}&userId=${user.id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: newComment })

      });

      if (!response.ok) throw new Error("Failed to post comment");
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err.message);
    }
  };

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
          console.error("Deregistration failed.");
        }
      } catch (error) {
        console.error("Error during deregistration:", error);
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

  if (!currentEffort) {
    return <p className="p-10 text-2xl">Effort not found</p>;
  }

  const formatDateToMMDDYYYY = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const formatTimeTo12Hour = (time24) => {
    const [hour, minute] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/efforts/delete/${currentEffort.effortId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      nav("/");
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete effort:', err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h3>
          <span className="text-3xl">{currentEffort.effortName}</span>
          <br />
          <Link to={`/account/${currentEffort.userId}`}><span className="text-2xl">By {currentEffort.organizerName}</span></Link>
        </h3>
        {isOrganizer ? (<div className="flex gap-6">
          <button className="text-2xl hover:text-red-700"
            onClick={handleDelete}
          ><MdDelete />
          </button>
          <button
            onClick={() => {
              setEditMode(!editMode)
              setEditedEffort({
                title: currentEffort?.effortName || '',
                description: currentEffort?.description || '',
                date: currentEffort?.startTime ? currentEffort.startTime.slice(0, 10) : '',
                startTime: currentEffort?.startTime ? new Date(currentEffort.startTime).toISOString().slice(11, 16) : '',
                endTime: currentEffort?.endTime ? new Date(currentEffort.endTime).toISOString().slice(11, 16) : '',
                location: currentEffort?.address
                  ? `${currentEffort.address}, ${currentEffort.city}, ${currentEffort.state} ${currentEffort.zipCode}`
                  : '',
                tags: Array.isArray(currentEffort?.tags) ? currentEffort.tags.map(tag => tag.name).join(', ') : '',
                maxVolunteers: currentEffort?.maxVolunteers || 1
              })
            }}
            className={`${editMode ? 'bg-gray-500 text-white' : 'bg-gray-100'} border border-gray-300 rounded-md p-2 text-2xl`}
          >
            Edit Effort
          </button>
        </div>) : (
          <button
            type="button"
            onClick={(e) => handleRegister(e)}
            className="border border-gray-300 rounded-md p-2 text-2xl"
            disabled={userEffortCount >= currentEffort.maxVolunteers && !registered}
          >
            {registered ? "Unregister" : "Register"}
          </button>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center p-8">
          <img src={`http://localhost:8080${currentEffort.imageUrl}`} alt="Effort" className="w-full h-[60vh] object-cover rounded-md" />
          <div className="flex flex-col w-full text-2xl px-10">
            <h4 className="text-3xl">Details</h4>
            <p>Date: {formatDate(currentEffort.startTime)}</p>
            <p>Starting Time: {formatTime(currentEffort.startTime)} </p>
            <p>Ending Time: {formatTime(currentEffort.endTime)} </p>
            <p>Location: {currentEffort.address}
              <br />
              {currentEffort.city}, {currentEffort.state} {currentEffort.zipCode}
            </p>

            {
              Array.isArray(currentEffort.tags) && currentEffort.tags.length > 0 && (
                <p>Tags: {currentEffort.tags.map(tag => tag.name).join(', ')}</p>
              )}

            <p>Volunteer Count: {userEffortCount} / {currentEffort.maxVolunteers} </p>
          </div>
        </div>

        <div className="p-8 text-2xl">
          <h4>Description</h4>
          <p>{currentEffort.description}</p>
        </div>

        {editMode && (
          <form onSubmit={async (e) => {
            e.preventDefault();

            try {
              const formData = new FormData();
              const payload = {
                title: editedEffort.title,
                description: editedEffort.description,
                date: formatDateToMMDDYYYY(editedEffort.date),
                startTime: formatTimeTo12Hour(editedEffort.startTime),
                endTime: formatTimeTo12Hour(editedEffort.endTime),
                location: editedEffort.location,
                tags: JSON.stringify(editedEffort.tags.split(',').map(tag => tag.trim())),
                maxVolunteers: parseInt(editedEffort.maxVolunteers),
                organizerId: user.id
              };
              formData.append("effort", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
              if (editedEffort.newImageFile) {
                formData.append("image", editedEffort.newImageFile);
              }

              const response = await fetch(`http://localhost:8080/efforts/${currentEffort.effortId}/update-effort`, {
                method: 'PUT',
                body: formData
              });

              if (!response.ok) throw new Error('Update failed');
              const updatedEffort = await response.json();
              setEditMode(false);
              window.location.reload();
            } catch (err) {
              console.error('Effort update failed:', err.message);
            }
          }}
            className="p-8 bg-white shadow-lg rounded-lg space-y-6">

            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Edit Effort</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedEffort.title}
                  onChange={(e) => setEditedEffort({ ...editedEffort, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  value={editedEffort.description}
                  onChange={(e) => setEditedEffort({ ...editedEffort, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editedEffort.date}
                  onChange={(e) => setEditedEffort({ ...editedEffort, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={editedEffort.tags}
                  onChange={(e) => setEditedEffort({ ...editedEffort, tags: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={editedEffort.startTime}
                  onChange={(e) => setEditedEffort({ ...editedEffort, startTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={editedEffort.endTime}
                  onChange={(e) => setEditedEffort({ ...editedEffort, endTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editedEffort.location}
                  onChange={(e) => setEditedEffort({ ...editedEffort, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditedEffort(prev => ({ ...prev, newImageFile: file }));
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Volunteers</label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={editedEffort.maxVolunteers}
                  onChange={(e) => setEditedEffort({ ...editedEffort, maxVolunteers: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="ml-4 underline text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}



        <div className="p-8 text-xl border-t border-gray-300">
          <h4 className="text-2xl mb-4">Comments</h4>

          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-gray-800 text-white disabled:bg-gray-300"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          )}

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to post one!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="border p-3 rounded">
                  <div className="font-semibold mb-1">@{c.username}</div>
                  <p className="mb-1">{c.comment}</p>
                  <div className="text-sm text-gray-500">{new Date(c.postedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div >
  )
}
