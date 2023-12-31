const DeleteFile = async (fileId) => {
    try {
      
      const apiUrl = `http://127.0.0.1:8000/api/todo/delete/file/${fileId}/`;
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('File deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  export default DeleteFile;