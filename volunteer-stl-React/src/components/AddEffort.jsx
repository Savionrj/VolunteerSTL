import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import volunteerImage from '../images/volunteer.jpg';

export default function AddEffort({ user, fetchEfforts }) {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    tags: '',
    description: '',
    imageUrl: '',
    maxVolunteers: 500,
    donationsNeeded: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDateToMMDDYYYY = (isoDate) => {
      const [year, month, day] = isoDate.split('-');
      return `${month}/${day}/${year}`;
    };

    const formatTimeTo12Hour = (time24) => {
      const [hour, minute] = time24.split(':');
      const date = new Date();
      date.setHours(parseInt(hour), parseInt(minute));
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const newEffort = {
      title: formData.title,
      date: formatDateToMMDDYYYY(formData.date),
      startTime: formatTimeTo12Hour(formData.startTime),
      endTime: formatTimeTo12Hour(formData.endTime),
      location: formData.location,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      description: formData.description,
      imageUrl: formData.imageUrl,
      maxVolunteers: formData.maxVolunteers,
      donationsNeeded: formData.donationsNeeded
    };

    try {
      const response = await fetch(`http://localhost:8080/efforts/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEffort)
      });
    } catch (error) {
      console.error("Error during effort creation:", error);
    }

    await fetchEfforts();
    nav('/');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <div className='flex p-8 justify-between'>
        <div className='flex flex-col w-1/4'>
          <label className='flex flex-col'>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className='flex flex-col'>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>


          <div className='flex'>
            <label className='flex flex-col'>
              Start Time:
              <input
                type="time"
                name="startTime"
                className="time-input"
                value={formData.startTime}
                onChange={handleChange}
              />
            </label>
            <label className='flex flex-col'>
              End Time:
              <input
                type="time"
                name="endTime"
                className="time-input"
                value={formData.endTime}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, City, State 12345"
            />
          </label>
        </div>

        <div className='flex flex-col w-1/4'>
          <label className='flex flex-col'>
            Description:
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Tags:
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </label>
          <div>
            <label>
              Image:
              <img src={volunteerImage} alt="A volunteer with back turned to the camera" className="h-20 w-30 object-cover" />
            </label>
            <div className='flex flex-col'>
              <label className='flex flex-col'>Max Volunteers
                <input
                  type="number"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleChange}
                />
              </label>
              <label className='flex flex-col'>Donations Needed?
                <input
                  type="checkbox"
                  name="donationsNeeded"
                  checked={formData.donationsNeeded}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </div></div>
      <button type="submit" >Submit Effort</button>
    </form>
  )
}
