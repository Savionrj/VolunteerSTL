import { useNavigate } from "react-router-dom";

export default function Settings({ user, setUser }) {

  const nav = useNavigate();

  const handleSignout = () => {
    setUser(null);
    nav('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <p className="text-gray-600 mb-8">
          Signed in as <span className="font-medium">{user?.username}</span>
        </p>

        <button
          onClick={handleSignout}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
