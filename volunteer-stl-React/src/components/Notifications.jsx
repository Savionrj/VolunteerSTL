import { useState } from "react";
import NotificationCard from "./NotificationCard"

export default function Notifications({ user, pendingConnections, getPendingConnections }) {

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Notifications</h2>

      {(pendingConnections.length > 0 ? (
        <div className="space-y-4">
          {pendingConnections.map((connectionRequest) => (
            <NotificationCard key={connectionRequest.connectionId || connectionRequest.id} connectionRequest={connectionRequest} onRespond={() => getPendingConnections()} />



          ))
          }</div>) : (
          <p className="text-center text-gray-500 text-lg mt-20">You Have No Notifications</p>
      ))}
    </div>
  )
}
