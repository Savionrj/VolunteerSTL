import { useParams } from "react-router-dom"
import { useState } from "react";

export default function EffortPage({ efforts }) {

  const { effortId } = useParams();
  const [register, setRegister] = useState(false)

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );

  if (!currentEffort) {
    return <div>Effort not found.</div>;
  }

  const handleRegister = (e) => {
    setRegister(!register);
    //Will return after I create user registration functionality
    }

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h3>
          <span className="text-3xl">{currentEffort.effortName}</span>
          <br />
          <span className="text-2xl">By {currentEffort.organizerName}</span>
        </h3>
        <button type="button" className="border border-gray-300 rounded-md p-2 text-2xl" onClick={(e) => handleRegister(e)}>
          {register ? "Unregister" : "Register"}
        </button>
      </div>
    </div>
  )
}
