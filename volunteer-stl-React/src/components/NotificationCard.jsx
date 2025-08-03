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
    <div className="flex justify-between border-t border-gray-500 my-2 text-2xl p-8">
      <Link to={`/account/${connectionRequest.senderUserId}`}>
        <p>{connectionRequest.senderFirstName} {connectionRequest.senderLastName}</p>
      </Link>

      {connectionRequest && (<div className="flex gap-8">
        <button onClick={acceptConnection} className="px-4 py-1 rounded hover:bg-green-600">Accept</button>
        <button onClick={declineConnection} className="px-4 py-1 rounded hover:bg-red-600">Decline</button>
      </div>)}

    </div>
  )
}
