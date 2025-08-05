import { Link } from "react-router-dom"

export default function NotificationCard({ connectionRequest, onRespond }) {


  const acceptConnection = async () => {
    try {
      const response = await fetch(`http://localhost:8080/connections/connection-response?response=accepted&connectionId=${connectionRequest.connectionId}`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onRespond();
    } catch (err) {
      console.error('Failed to respond to connection:', err.message);
    }
  }

  const declineConnection = async () => {
    try {
      const response = await fetch(`http://localhost:8080/connections/connection-response?response=rejected&connectionId=${connectionRequest.connectionId}`, {
        method: 'PATCH'
      }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onRespond();
    } catch (err) {
      console.error('Failed to respond to connection:', err.message);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
      <Link to={`/account/${connectionRequest.senderUserId}`} className="text-lg font-medium text-gray-800 hover:text-shadow-lg text-shadow-amber-200">
        <p>{connectionRequest.senderFirstName} {connectionRequest.senderLastName}</p>
      </Link>

      {connectionRequest && (<div className="flex gap-3">
        <button onClick={acceptConnection} className="px-4 py-2 rounded-md text-sm hover:bg-[#162c64] hover:text-white transition">Accept</button>
        <button onClick={declineConnection} className="px-4 py-2 rounded-md text-sm hover:bg-red-700 hover:text-white transition">Decline</button>
      </div>)}

    </div>
  )
}
