import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/messages";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch queue status");
        return res.json();
      })
      .then(setData)
      .catch(setError);
  }, []);

  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Queue Status</h1>
      <div className="space-y-4">
        {data.map((entry) => {
          const parsedValue = JSON.parse(entry.value);
          return (
            <div key={entry.key} className="bg-white shadow p-4 rounded-lg">
              <p className="font-semibold">Key: {entry.key}</p>
              <p>Total Documents: {parsedValue.totalDocuments}</p>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

export default App;