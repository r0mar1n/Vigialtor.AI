<template>
    <div class="blocklist-content">
      <div class="current-page">
        <h1>No Hoot List</h1>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Website</th>
              <th>Detected On</th>
              <th>Reason for Flagging</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>example.com</td>
              <td>23-07-2024</td>
              <td>Phishing content</td>
              <td>Suspicious content</td>
            </tr>
            <tr>
              <td>abc.com</td>
              <td>23-07-2024</td>
              <td>Malware</td>
              <td>Malicious code</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BlocklistView",
  };
  </script>
  
  <style scoped>
  .blocklist-content {
    padding: 20px;
    flex-grow: 1;
    background: linear-gradient(135deg, #1a1a1a, #333333);
    min-height: 100vh;
  }
  
  .current-page {
    background-color: #000000;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .current-page h1 {
    color: #ffffff;
    font-weight: normal;
    font-family: 'Jersey 10', sans-serif;
    margin-left: 30px;
  }
  
  .table-container {
    background-color: #000000;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 15px;
    color: #ffffff;
    border: 1px solid #444444;
    text-align: left;
  }
  
  th {
    font-weight: normal;
  }
  
  tbody tr:hover {
    background-color: #222222;
  }
  </style>
  