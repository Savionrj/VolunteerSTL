import { useParams } from "react-router-dom"

export default function EffortPage({ efforts }) {

  const {effortId} = useParams();

  const currentEffort = efforts.find(
    (effort) => effort.effortId.toString() === effortId
  );

  if (!currentEffort) {
    return <div>Effort not found.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
        <h3>
          <span className="text-3xl">{currentEffort.effortName}</span>
        <br/>
        <span className="text-2xl">By {currentEffort.organizerName}</span>
        </h3>
        <button>
          Register
        </button>
      </div>
    </div>
  )
}
