import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { URL } from "../config";

export function ShareBrain() {
  const [user, setUser] = useState("");
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const { hash } = useParams();

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await axios.get(`${URL}/sharebrain/${hash}`);
        if (response.status === 200) {
          setUser(response.data.username);
          setContent(response.data.content);
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load shared content.");
        }
      }
    }
    fetchContent();
  }, [hash]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
            🧠 {user}'s Brain Vault
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Shared Notes and Content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Content Grid */}
        {content.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {content.map((item: any) => (
              <Card
                key={item._id}
                title={item.title}
                link={item.link}
                type={item.type}
                description={item.description}
                tags={item.tag}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No contents to share</p>
          </div>
        )}
      </div>
    </div>
  );
}
