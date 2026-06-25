import { useState } from 'react';
import axios from '../api/axiosConfig';

function NewMessageForm({ onMessageAdded }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/messages/new', { title, body });
      if (response.data.success) {
        onMessageAdded(response.data.data);
        setTitle('');
        setBody('');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post message');
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Message</h2>
      <form onSubmit={handleSubmit} className="standard-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Message Title"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          required
        />
        <button type="submit" className="btn-primary">Post Message</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default NewMessageForm;