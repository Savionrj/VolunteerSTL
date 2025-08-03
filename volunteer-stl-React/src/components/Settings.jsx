import { useNavigate } from "react-router-dom"

export default function Settings({ user, setUser }) {

  const nav = useNavigate();

  const handleSignout = () => {
    setUser(null);
  }

  return (
    <div className="flex flex-col justify-center">
      <button onClick={handleSignout} className="text-4xl text-red-500">Sign Out</button>
    </div>
  )
}
