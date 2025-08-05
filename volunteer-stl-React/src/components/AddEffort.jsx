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
    imageFile: null,
    maxVolunteers: 500,
    donationsNeeded: false
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      imageFile: file
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
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

    const formDataFile = new FormData();
    formDataFile.append("title", formData.title);
    formDataFile.append("date", formatDateToMMDDYYYY(formData.date));
    formDataFile.append("startTime", formatTimeTo12Hour(formData.startTime));
    formDataFile.append("endTime", formatTimeTo12Hour(formData.endTime));
    formDataFile.append("location", formData.location);
    formDataFile.append("description", formData.description);
    formDataFile.append("tags", JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));
    formDataFile.append("maxVolunteers", String(formData.maxVolunteers));
    formDataFile.append("donationsNeeded", String(formData.donationsNeeded));

    if (formData.imageFile) {
      formDataFile.append("image", formData.imageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/efforts/new-effort/${user.id}`, {
        method: 'POST',
        body: formDataFile
      });

      if (!response.ok) {
        console.error("Failed to create effort:", await response.text());
      }

    } catch (error) {
      console.error("Error during effort creation:", error);
    }

    await fetchEfforts();
    nav('/');
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg space-y-6">

      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Add a New Effort</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Comma-separated (e.g. food,school,trees)"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="123 Main St, City, State zipcode"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"

            className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition'
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Volunteers</label>
          <input
            type="number"
            name="maxVolunteers"
            value={formData.maxVolunteers}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4B82F] hover:border-[#D4B82F] transition"
          />
        </div>
      </div>

      <div className="pt-6 text-center">
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition"
        >
          Add Effort
        </button>
      </div>
    </form>


  )
}
