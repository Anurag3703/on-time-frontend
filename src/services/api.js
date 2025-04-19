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
    return await response.json();
  } catch (error) {
    console.error('Error adding deadline:', error);
    throw error;
  }
};