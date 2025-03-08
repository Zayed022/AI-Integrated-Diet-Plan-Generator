import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", { withCredentials: true }); // Call the logout API
      localStorage.removeItem("accessToken"); // Remove token from storage (if stored)
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
