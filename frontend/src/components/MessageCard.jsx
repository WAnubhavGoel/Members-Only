import { useAuth } from '../context/AuthContext';

function MessageCard({ message, onDelete }) {
  const { currentUser } = useAuth();
  
  return (
    <div className="message-card">
      <div className="message-header">
        <span className="author-name">
          {message.author.firstName} {message.author.lastName} wrote:
        </span>
        {currentUser?.isAdmin && (
          <button className="btn-delete" onClick={() => onDelete(message.id)}>
            Delete
          </button>
        )}
      </div>
      <div className="message-body-container">
        <h3>{message.title}</h3>
        <p>{message.body}</p>
      </div>
      <div className="message-footer">
        <span className="message-date">{message.createdAt}</span>
      </div>
    </div>
  );
}

export default MessageCard;