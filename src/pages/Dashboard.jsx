import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Dashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      fetch("http://localhost:8080/api/messages").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      }),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);

  const confirmPurge = async () => {
    if (!selectedQueue) return;
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${encodeURIComponent(selectedQueue)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to purge queue");
      queryClient.invalidateQueries(["messages"]);
    } catch (err) {
      alert(err.message);
    } finally {
      setModalOpen(false);
      setSelectedQueue(null);
    }
  };

  return (
    <div className="text-gray-600">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error.message}</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item) => {
            const parsed = JSON.parse(item.value);
            return (
              <div
                key={item.key}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.key}</h3>
                    <p className="text-sm text-gray-500">
                      Total Documents: <span className="text-blue-600 font-bold">{parsed.totalDocuments}</span>
                    </p>
                  </div>
                  <button
                    title="Purge Queue"
                    onClick={() => {
                      setSelectedQueue(item.key);
                      setModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Purge Queue"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v11a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm1 4a.5.5 0 011 0v8a.5.5 0 01-1 0V6zm4 0a.5.5 0 011 0v8a.5.5 0 01-1 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Purge</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to purge the queue <span className="font-semibold text-red-600">{selectedQueue}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurge}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
