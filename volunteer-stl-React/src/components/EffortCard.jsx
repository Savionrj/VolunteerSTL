import volunteerImage from '../images/volunteer.jpg';
import { Link } from 'react-router-dom';

export default function EffortCard({ effort }) {

  const start = new Date(effort.startTime);

  return (
    <Link to={`/effort/${effort.effortId}`} className="flex flex-col border border-gray-500 rounded-md w-full my-10 p-2">

      <img src={`http://localhost:8080${effort.imageUrl}`} alt="Effort" className="w-full h-58 object-cover rounded-t-md" />

      <div className="p-3">
        <h3 className='font-semibold text-lg truncate'>{effort.effortName}</h3>

        <p>{new Date(effort.startTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })} | {new Date(effort.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        })}</p>

        <p>Organized By {effort.organizerName}</p>
      </div>
    </Link>

  );
}
