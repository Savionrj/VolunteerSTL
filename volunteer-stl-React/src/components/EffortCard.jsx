import volunteerImage from '../images/volunteer.jpg';

export default function EffortCard({ effort }) {

  const start = new Date(effort.startTime);

  return (
    <div className="flex flex-col border border-gray-500 rounded-md my-10 mx-8">
      <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="w-full h-48 object-cover rounded-t-md" />

      <div className="p-3">
        <h3 className='text-2xl'>{effort.effortName}</h3>

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
    </div>
  );
}
