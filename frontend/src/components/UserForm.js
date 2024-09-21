import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = () => {
const [formData, setFormData] = useState({
  name: '',
  socialHandle: '',
  images: []
});

const [imagePreviews, setImagePreviews] = useState([]);
const [uploadProgress, setUploadProgress] = useState(0);
const [message, setMessage] = useState('');

// Handle input changes
const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'images') {
    const selectedFiles = Array.from(files);
    
    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB per image
    const validFiles = [];
    const previews = [];

    selectedFiles.forEach(file => {
      if (validTypes.includes(file.type) && file.size <= maxSize) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      } else {
        alert(`File ${file.name} is invalid. Only JPEG, PNG, GIF under 5MB are allowed.`);
      }
    });

    setFormData(prevState => ({ ...prevState, images: validFiles }));
    setImagePreviews(previews);
  } else {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }
};

// Cleanup image previews to prevent memory leaks
useEffect(() => {
  return () => {
    imagePreviews.forEach(src => URL.revokeObjectURL(src));
  };
}, [imagePreviews]);

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setUploadProgress(0);

  const data = new FormData();
  data.append('name', formData.name);
  data.append('socialHandle', formData.socialHandle);
  formData.images.forEach((image) => {
    data.append('images', image); // Adjust if backend expects 'images[]'
  });

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    });
    setMessage(res.data.message);
    setFormData({ name: '', socialHandle: '', images: [] });
    setImagePreviews([]);
  } catch (err) {
    console.error('Error submitting form:', err);
    if (err.response) {
      setMessage(`Error: ${err.response.data.message || 'Server Error'}`);
    } else if (err.request) {
      setMessage('Error: No response from server.');
    } else {
      setMessage(`Error: ${err.message}`);
    }
    setUploadProgress(0);
  }
};

return (
  <div className="container mt-5">
    <h2>User Submission Form</h2>
    {message && <div className="alert alert-info">{message}</div>}
    <form onSubmit={handleSubmit}>
      {/* Name Input */}
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      {/* Social Media Handle Input */}
      <div className="form-group mt-3">
        <label htmlFor="socialHandle">Social Media Handle:</label>
        <input 
          type="text" 
          className="form-control" 
          id="socialHandle" 
          name="socialHandle" 
          value={formData.socialHandle} 
          onChange={handleChange} 
          required 
        />
      </div>

      {/* Image Upload */}
      <div className="form-group mt-3">
        <label htmlFor="images">Upload Images:</label>
        <input 
          type="file" 
          className="form-control" 
          id="images" 
          name="images" 
          multiple 
          accept="image/*"
          onChange={handleChange} 
          required 
        />
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-3">
          <h5>Image Previews:</h5>
          <div className="row">
            {imagePreviews.map((src, index) => (
              <div key={index} className="col-md-3 mb-3">
                <img src={src} alt={`Preview ${index}`} className="img-fluid img-thumbnail" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && (
        <div className="progress mt-3">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${uploadProgress}%` }} 
            aria-valuenow={uploadProgress} 
            aria-valuemin="0" 
            aria-valuemax="100"
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary mt-4">Submit</button>
    </form>
  </div>
);
};

export default UserForm;