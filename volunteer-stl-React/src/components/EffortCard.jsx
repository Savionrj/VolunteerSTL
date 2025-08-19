import volunteerImage from '../images/volunteer.jpg';
import { Link } from 'react-router-dom';

export default function EffortCard({ effort }) {

  const eventTime = new Date(effort.endTime);
  const hasPassed = eventTime.getTime() <= Date.now();
  console.log(hasPassed ? "past" : "upcoming");

  return (
    <Link to={`/effort/${effort.effortId}`} className="flex flex-col border-[#8E0020] border-2 rounded-md w-full h-90 my-10 p-2 bg-white hover:border-[#D4B82F] transition-colors">

      <img src={`http://localhost:8080${effort.imageUrl}`} alt="Effort picture uploaded by user" className={`w-full h-58 object-cover rounded-md ${hasPassed && 'grayscale-80'}`} />

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
