import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import MessageCard from "../components/MessageCard";

function HomePage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/messages");
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/messages/${id}`);
      if (response.data.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="home-page">
      <div className="message-board">
        {messages.map((msg) => (
          <MessageCard key={msg.id} message={msg} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
