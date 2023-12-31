const DownloadFIle = async (fileId, filename) => {
    try {
    
      const apiUrl = `http://127.0.0.1:8000/api/todo/download/file/${fileId}/`;
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
  
     
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      console.log(filename);
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  
      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  export default DownloadFIle;