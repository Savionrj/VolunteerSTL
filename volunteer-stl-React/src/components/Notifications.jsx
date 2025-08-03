import { useState } from "react";
import NotificationCard from "./NotificationCard"

export default function Notifications({ user }) {

const [type, setType] = useState();

  return (
    <div className="flex flex-col pt-8">
      <NotificationCard type={type} />
    </div>
  )
}
