import { Link } from "react-router-dom"
import Button from "./Button";

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

        <Button clickedIt={acceptConnection} buttonName={'Accept'} classname="px-4 py-2 rounded-md text-sm hover:bg-[#162c64] hover:text-white transition" />

        <Button clickedIt={declineConnection} buttonName={'Decline'} classname="px-4 py-2 rounded-md text-sm hover:bg-red-700 hover:text-white transition" />

      </div>)}

    </div>
  )
}
