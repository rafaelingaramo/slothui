import React, { useEffect, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081/ws");

    socket.onmessage = (event) => {
      setLogs((prevLogs) => [event.data, ...prevLogs]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Live Logs</h2>
      <div className="bg-gray-900 text-green-400 p-4 rounded h-[70vh] overflow-y-auto font-mono text-sm">
        {logs.length === 0 && <p className="text-gray-500">Waiting for log data...</p>}
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default Logs;
