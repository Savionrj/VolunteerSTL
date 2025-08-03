import { useState } from "react";
import NotificationCard from "./NotificationCard"

export default function Notifications({ user, pendingConnections, getPendingConnections }) {

  return (
    <div className="flex flex-col pt-8">
      {(pendingConnections.length > 0 ? (
        pendingConnections.map((connectionRequest) => (
          <NotificationCard key={connectionRequest.connectionId || connectionRequest.id} connectionRequest={connectionRequest} onRespond={() => getPendingConnections()} />

          //put my message logic here
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500 pt-15">You Have No Notifications</p>
      ))}
    </div>
  )
}
