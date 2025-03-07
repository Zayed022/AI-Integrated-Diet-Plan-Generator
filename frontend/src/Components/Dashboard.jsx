import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const colors = ["#FF5733", "#33FF57", "#337BFF", "#FFD433"];

const Dashboard = () => {
  const [consumedMeals, setConsumedMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; // Prevents setting state on unmounted component
    const fetchConsumedMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User is not authenticated");

        const response = await axios.get("/api/v1/meal/consumed-meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          const mealsData = response.data.data[0] || null; // Ensure null if no data
          setConsumedMeals(mealsData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch consumed meals.");
          setLoading(false);
        }
      }
    };

    fetchConsumedMeals();
    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!consumedMeals) return <p className="text-center text-gray-500">No meals consumed yet.</p>;

  const data = [
    { name: "Calories", value: consumedMeals.totalCalories },
    { name: "Protein", value: consumedMeals.totalProtein },
    { name: "Carbs", value: consumedMeals.totalCarbs },
    { name: "Fats", value: consumedMeals.totalFats },
  ];

  return (
    <div className="dashboard p-6 bg-white shadow-md rounded-md text-center">
      <h2 className="text-xl font-semibold mb-4">Consumed Meals Summary</h2>
      <PieChart width={400} height={400}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <ul className="mt-4 space-y-2">
        {data.map((item, index) => (
          <li key={index} className="text-lg">
            <strong>{item.name}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
