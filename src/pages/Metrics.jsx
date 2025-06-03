import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8082/metrics");
    socketRef.current.onmessage = (event) => {
      setMetrics(JSON.parse(event.data));
    };
    return () => socketRef.current.close();
  }, []);

  if (!metrics) return <p className="p-4">Waiting for metrics...</p>;

  const heapUsed = metrics.heapMetrics.used;
  const heapMax = metrics.heapMetrics.max;
  const nonHeapUsed = metrics.nonHeapMetrics.used;

  const os = metrics.osMetrics;

  const byteToMB = (bytes) => Math.round(bytes / 1024 / 1024);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* GC Metrics */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">GC Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={metrics.gcMetrics}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="collectionCount" fill="#8884d8" name="Count" />
            <Bar dataKey="collectionTime" fill="#82ca9d" name="Time (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heap Usage */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Heap Memory</h3>
        <PieChart width={300} height={200}>
          <Pie
            data={[
              { name: "Used", value: heapUsed },
              { name: "Free", value: heapMax - heapUsed },
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            <Cell fill="#ff7300" />
            <Cell fill="#d0ed57" />
          </Pie>
          <Tooltip />
        </PieChart>
        <p className="text-sm text-center mt-2">
          {byteToMB(heapUsed)}MB / {byteToMB(heapMax)}MB
        </p>
      </div>

      {/* Non-Heap Usage */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Non-Heap Memory</h3>
        <PieChart width={300} height={200}>
          <Pie
            data={[
              { name: "Used", value: nonHeapUsed },
              { name: "Free", value: 1 }, // Fallback since max=-1
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            <Cell fill="#8884d8" />
            <Cell fill="#eeeeee" />
          </Pie>
          <Tooltip />
        </PieChart>
        <p className="text-sm text-center mt-2">
          {byteToMB(nonHeapUsed)}MB used
        </p>
      </div>

      {/* CPU Load */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">CPU Load</h3>
        <p className="text-xl font-bold text-center">
          {(os.cpuLoad * 100).toFixed(2)}%
        </p>
      </div>

      {/* Threads */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Threads</h3>
        <ul className="text-sm">
          <li>Total: {metrics.threadMetrics.threadCount}</li>
          <li>Daemon: {metrics.threadMetrics.daemonThreadCount}</li>
          <li>Peak: {metrics.threadMetrics.peakThreadCount}</li>
          <li>Started: {metrics.threadMetrics.totalStartedThreadCount}</li>
        </ul>
      </div>

      {/* RAM Usage */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">System Memory</h3>
        <PieChart width={300} height={200}>
          <Pie
            data={[
              { name: "Used", value: os.totalMemorySize - os.freeMemorySize },
              { name: "Free", value: os.freeMemorySize },
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            <Cell fill="#0088FE" />
            <Cell fill="#00C49F" />
          </Pie>
          <Tooltip />
        </PieChart>
        <p className="text-sm text-center mt-2">
          {byteToMB(os.totalMemorySize - os.freeMemorySize)}MB used / {byteToMB(os.totalMemorySize)}MB total
        </p>
      </div>
    </div>
  );
}

export default Metrics;
