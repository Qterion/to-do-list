const DeleteTodoItem = async (itemId) => {
  const apiUrl = 'http://127.0.0.1:8000/api/todo/delete/';
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${apiUrl}${itemId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      console.log(`Item ${itemId} deleted successfully.`);
    } else {
      console.error(`Failed to delete item ${itemId}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('An error occurred while deleting the item:', error);
  }
};

export default DeleteTodoItem;