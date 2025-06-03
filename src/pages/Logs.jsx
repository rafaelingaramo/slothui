import React, { useEffect, useRef, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimeout = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  const connectWebSocket = () => {
    if (retryCount.current >= MAX_RETRIES) {
      console.warn("Max retries reached. Giving up.");
      return;
    }

    if (socketRef.current) socketRef.current.close();

    retryCount.current++;
    const socket = new WebSocket("ws://localhost:8081/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      retryCount.current = 0;
      setConnected(true);
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      setLogs((prevLogs) => [event.data, ...prevLogs]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket closed, retrying in 3 seconds...");
      setConnected(false);
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return (
    <div className="p-4 text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">Live Logs</h2>
          <span className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} title={connected ? 'Connected' : 'Disconnected'}></span>
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={connectWebSocket}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            disabled={connected}
          >
            {connected ? "Connected" : "Reconnect"}
          </button>
          <button
            onClick={() => {
              if (socketRef.current) socketRef.current.close();
              setConnected(false);
              console.log("WebSocket manually disconnected");
            }}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            disabled={!connected}
          >
            Disconnect
          </button>
        </div>
      </div>
      <div className="bg-gray-900 text-green-400 p-4 rounded h-[70vh] overflow-y-auto font-mono text-sm flex flex-col-reverse">
        {logs.length === 0 && <p className="text-gray-500">Waiting for log data...</p>}
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default Logs;
