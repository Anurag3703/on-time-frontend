// services/api.js - API Service
const API_BASE_URL = 'https://deadlinescheduler-2.onrender.com/api';

export const addUser = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const getAllDeadlines = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deadlines/all/${email}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    return [];
  }
};

export const addDeadline = async (deadline) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deadlines/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deadline),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add deadline');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding deadline:', error);
      throw error;
    }
  };

export const deleteDeadline = async (email, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deadlines/delete?email=${email}&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete deadline');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error deleting deadline:', error);
      throw error;
    }
  };