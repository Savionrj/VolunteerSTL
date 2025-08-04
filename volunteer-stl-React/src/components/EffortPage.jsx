import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import volunteerImage from '../images/volunteer.jpg';

export default function EffortPage({ efforts, user }) {

  const { effortId } = useParams();
  const [registered, setRegistered] = useState();
  const [userEffortCount, setUserEffortCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );

  const userEffort = currentEffort && user
    ? { userId: user.id, effortId: currentEffort.effortId }
    : null;

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

  if (!currentEffort) {
    return <p className="p-10 text-2xl">Effort not found</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h3>
          <span className="text-3xl">{currentEffort.effortName}</span>
          <br />
          <Link to={`/account/${currentEffort.userId}`}><span className="text-2xl">By {currentEffort.organizerName}</span></Link>
        </h3>
        <button type="button" className="border border-gray-300 rounded-md p-2 text-2xl" onClick={(e) => handleRegister(e)} disabled={userEffortCount >= currentEffort.maxVolunteers && !registered}>
          {registered ? "Unregister" : "Register"}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center p-8">
          <img src={`http://localhost:8080${currentEffort.imageUrl}`} alt="Effort" className="w-1/2 h-full object-cover rounded-md" />
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
    </div>
  )
}
