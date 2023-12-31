
const UpdateCheckbox = async (taskId, checkbox) => {
    
    // Send PATCH request to update completed status on the backend
    try {
      const accessToken = localStorage.getItem('accessToken');
      await fetch(`http://127.0.0.1:8000/api/todo/edit/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ completed: checkbox }),
      });
    } catch (error) {
      console.error('Error updating completed status:', error);
    }
  };
  export default UpdateCheckbox;