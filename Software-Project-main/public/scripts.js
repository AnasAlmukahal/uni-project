/*document.addEventListener('DOMContentLoaded', () => {
  fetchCollections();
});
function fetchCollections() {
  console.log('Fetching collections...');
  axios.get('http://127.0.0.1:5500/api/collections')
    .then(response => {
      console.log('Received collections:', response.data);
      const select = document.getElementById('collectionSelect');
      select.innerHTML = '<option value="">Select a collection</option>';
      response.data.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching collections:', error);
    });
}


function handleCollectionChange() {
  const collectionName = document.getElementById('collectionSelect').value;
  console.log('Selected collection:', collectionName);
  
  if (collectionName) {
    fetchCollectionData(collectionName);
  } else {
    document.getElementById('dynamicForm').innerHTML = '';
    document.getElementById('collectionData').innerHTML = '';
  }
}

function fetchCollectionData(collectionName) {
  console.log(`Fetching data for collection: ${collectionName}`);
  axios.get(`/api/collection-data/${collectionName}`)
    .then(response => {
      console.log('Received response:', response);
      console.log('Collection data:', response.data);
      if (Array.isArray(response.data)) {
        displayCollectionData(response.data);
        if (response.data.length > 0) {
          generateFormFields(response.data[0]);
        } else {
          generateEmptyForm(collectionName);
        }
      } else {
        console.error('Received non-array data:', response.data);
        document.getElementById('collectionData').innerHTML = 'Error: Received invalid data';
        generateEmptyForm(collectionName);
      }
    })
    .catch(error => {
      console.error('Error fetching collection data:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      document.getElementById('collectionData').innerHTML = 'Error fetching collection data';
      generateEmptyForm(collectionName);
    });
}

function displayCollectionData(data) {
  const dataContainer = document.getElementById('collectionData');
  dataContainer.innerHTML = '<h2>Collection Data</h2>';
  
  const table = document.createElement('table');
  const headers = Object.keys(data[0] || {});
  
  // Create table header
  const headerRow = table.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  // Create table rows
  data.forEach(item => {
    const row = table.insertRow();
    headers.forEach(header => {
      const cell = row.insertCell();
      cell.textContent = item[header];
    });
  });
  
  dataContainer.appendChild(table);
}

function generateFormFields(schema) {
  const form = document.getElementById('dynamicForm');
  form.innerHTML = '<h2>Add New Document</h2>';
  
  Object.keys(schema).forEach(field => {
    if (field !== '_id') {
      const div = document.createElement('div');
      div.innerHTML = `
        <label for="${field}">${field}:</label>
        <input type="text" id="${field}" name="${field}">
      `;
      form.appendChild(div);
    }
  });
  
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.onclick = submitForm;
  form.appendChild(submitButton);
}

function submitForm() {
  const formData = new FormData(document.getElementById('dynamicForm'));
  const data = Object.fromEntries(formData.entries());
  const collectionName = document.getElementById('collectionSelect').value;

  // If it's an empty form, create a new document with the entered field
  if (data.newField && data.newValue) {
    data[data.newField] = data.newValue;
    delete data.newField;
    delete data.newValue;
  }

  axios.post(`http://127.0.0.1:5500/api/collection-data/${collectionName}`, data)
    .then(response => {
      alert('Data submitted successfully!');
      fetchCollectionData(collectionName);  // Refresh the displayed data
    })
    .catch(error => {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    });
}
function generateEmptyForm(collectionName) {
  const form = document.getElementById('dynamicForm');
  form.innerHTML = `
    <h2>Add New Document to ${collectionName}</h2>
    <div>
      <label for="newField">Field Name:</label>
      <input type="text" id="newField" name="newField">
    </div>
    <div>
      <label for="newValue">Value:</label>
      <input type="text" id="newValue" name="newValue">
    </div>
    <button type="button" onclick="submitForm()">Submit</button>
  `;
}
function clearForm() {
  document.getElementById('dynamicForm').reset();
}
function fetchCollectionData(collectionName) {
  console.log(`Fetching data for collection: ${collectionName}`);
  axios.get(`/api/collection-data/${collectionName}`)
    .then(response => {
      console.log('Received response:', response);
      console.log('Collection data:', response.data);
      if (Array.isArray(response.data)) {
        displayCollectionData(response.data);
        if (response.data.length > 0) {
          generateFormFields(response.data[0]);
        } else {
          generateEmptyForm(collectionName);
        }
      } else {
        console.error('Received non-array data:', response.data);
        document.getElementById('collectionData').innerHTML = 'Error: Received invalid data';
        generateEmptyForm(collectionName);
      }
    })
    .catch(error => {
      console.error('Error fetching collection data:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      document.getElementById('collectionData').innerHTML = 'Error fetching collection data';
      generateEmptyForm(collectionName);
    });
}*/

document.addEventListener('DOMContentLoaded', () => {
  fetchCollections();
});

function fetchCollections() {
  console.log('Fetching collections...');
  axios.get('http://127.0.0.1:5500/api/collections')
    .then(response => {
      console.log('Received collections:', response.data);
      const select = document.getElementById('collectionSelect');
      select.innerHTML = '<option value="">Select a collection</option>';
      response.data.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching collections:', error);
    });
}

function handleCollectionChange() {
  const collectionName = document.getElementById('collectionSelect').value;
  console.log('Selected collection:', collectionName);

  if (collectionName) {
    fetchCollectionData(collectionName);
  } else {
    document.getElementById('dynamicForm').innerHTML = '';
    document.getElementById('collectionData').innerHTML = '';
  }
}

function fetchCollectionData(collectionName) {
  console.log(`Fetching data for collection: ${collectionName}`);
  axios.get(`/api/collection-data/${collectionName}`)
    .then(response => {
      console.log('Received response:', response);
      console.log('Collection data:', response.data);
      if (Array.isArray(response.data)) {
        displayCollectionData(response.data);
        if (response.data.length > 0) {
          generateFormFields(response.data[0]);
        } else {
          generateEmptyForm(collectionName);
        }
      } else {
        console.error('Received non-array data:', response.data);
        document.getElementById('collectionData').innerHTML = 'Error: Received invalid data';
        generateEmptyForm(collectionName);
      }
    })
    .catch(error => {
      console.error('Error fetching collection data:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      document.getElementById('collectionData').innerHTML = 'Error fetching collection data';
      generateEmptyForm(collectionName);
    });
}

function displayCollectionData(data) {
  const dataContainer = document.getElementById('collectionData');
  dataContainer.innerHTML = '<h2>Collection Data</h2>';

  const table = document.createElement('table');
  const headers = Object.keys(data[0] || {});

  // Create table header
  const headerRow = table.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  // Create table rows
  data.forEach(item => {
    const row = table.insertRow();
    headers.forEach(header => {
      const cell = row.insertCell();
      cell.textContent = item[header];
    });
  });

  dataContainer.appendChild(table);
}

function generateFormFields(schema) {
  const form = document.getElementById('dynamicForm');
  form.innerHTML = '<h2>Add New Document</h2>';

  Object.keys(schema).forEach(field => {
    if (field !== '_id') {
      const div = document.createElement('div');
      div.innerHTML = `
        <label for="${field}">${field}:</label>
        <input type="text" id="${field}" name="${field}">
      `;
      form.appendChild(div);
    }
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.onclick = submitForm;
  form.appendChild(submitButton);
}

function submitForm() {
  const formData = new FormData(document.getElementById('dynamicForm'));
  const data = Object.fromEntries(formData.entries());
  const collectionName = document.getElementById('collectionSelect').value;

  // If it's an empty form, create a new document with the entered field
  if (data.newField && data.newValue) {
    data[data.newField] = data.newValue;
    delete data.newField;
    delete data.newValue;
  }

  axios.post(`http://127.0.0.1:5500/api/collection-data/${collectionName}`, data,{
    timeout:200000})
    .then(response => {
      alert('Data submitted successfully!');
      fetchCollectionData(collectionName); // Refresh the displayed data
    })
    .catch(error => {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    });
}

function generateEmptyForm(collectionName) {
  const form = document.getElementById('dynamicForm');
  form.innerHTML = `
    <h2>Add New Document to ${collectionName}</h2>
    <div>
      <label for="newField">Field Name:</label>
      <input type="text" id="newField" name="newField">
    </div>
    <div>
      <label for="newValue">Value:</label>
      <input type="text" id="newValue" name="newValue">
    </div>
    <button type="button" onclick="submitForm()">Submit</button>
  `;
}