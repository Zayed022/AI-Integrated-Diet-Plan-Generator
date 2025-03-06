import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const colors = ["#FF5733", "#33FF57", "#337BFF", "#FFD433"];

const Dashboard = () => {
  const [consumedMeals, setConsumedMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsumedMeals = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("/api/v1/meals/consumed-meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConsumedMeals(response.data.data[0]); 
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch consumed meals.");
        setLoading(false);
      }
    };

    fetchConsumedMeals();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const data = [
    { name: "Calories", value: consumedMeals.totalCalories },
    { name: "Protein", value: consumedMeals.totalProtein },
    { name: "Carbs", value: consumedMeals.totalCarbs },
    { name: "Fats", value: consumedMeals.totalFats },
  ];

  return (
    <div className="dashboard">
      <h2>Consumed Meals Summary</h2>
      {consumedMeals ? (
        <>
          <PieChart width={400} height={400}>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <strong>{item.name}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No meals consumed yet.</p>
      )}
    </div>
  );
};

export default Dashboard
