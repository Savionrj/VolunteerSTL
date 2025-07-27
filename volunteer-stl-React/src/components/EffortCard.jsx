import volunteerImage from '../images/volunteer.jpg';

export default function EffortCard({effort}) {
  return (
      <div className="flex flex-col border border-gray-500 rounded-md mt-10 mx-20">
        <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="w-full h-48 object-cover rounded-t-md" />
        <h3 className='text-2xl'>{effort.effortName}</h3>
        <p>Date | Start Time</p>
        <p>Organized By</p>
      </div>
  );
}
