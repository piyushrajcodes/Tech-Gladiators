import React, { useState } from 'react';
import axios from 'axios';

const Preferences = ({ user = {} }) => {
    const [preferredChannel, setPreferredChannel] = useState(user.preferred_channel || 'Email');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5001/api/user/preferences', 
                { preferred_channel: preferredChannel }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Failed to update preferences');
        }
    };

    return (
        <div>
            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title">Communication Preferences</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="preferredChannel">Preferred Channel</label>
                            <select 
                                id="preferredChannel"
                                className="form-control"
                                value={preferredChannel}
                                onChange={(e) => setPreferredChannel(e.target.value)}
                            >
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Update</button>
                    </form>
                    {message && <p className="mt-3">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Preferences;
