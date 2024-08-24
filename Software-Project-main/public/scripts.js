document.addEventListener('DOMContentLoaded', () => {
  fetchCollections();
});
document.getElementById('dynamicForm').addEventListener('submit', submitForm);

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
  const formContainer = document.getElementById("formContainer");

  if (!formContainer) {
    console.error('formContainer element not found');
    return;
  }
  
  const existingForm = formContainer.querySelector('form');
  if (existingForm) {
    formContainer.removeChild(existingForm);
  }

  if (data.length === 0) {
    alert("No data found in the collection.");
    return;
  }
  const firstEntry = data[0];
  const form = document.createElement("form");
  form.id = "dynamicForm"; 

  Object.keys(firstEntry).forEach(key => {
    const fieldLabel = document.createElement("label");
    fieldLabel.textContent = key;
    form.appendChild(fieldLabel);

    const fieldInput = document.createElement("input");
    fieldInput.type = "text";
    fieldInput.name = key;
    fieldInput.value = firstEntry[key] || ''; 
    form.appendChild(fieldInput);

    const lineBreak = document.createElement("br");
    form.appendChild(lineBreak);
  });
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  form.appendChild(submitButton);
  formContainer.appendChild(form);
  console.log('Form appended:', formContainer.querySelectorAll('form').length);
  form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    submitForm(event); 
  });
}

function generateFormFields(schema) {
  const form = document.getElementById('dynamicForm');
  form.innerHTML = '<h2>Add New Document</h2>';

  Object.keys(schema).forEach(field => {
    if (field !== '_id') { // Exclude '_id'
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

function submitForm(event) {
  event.preventDefault();  // Prevent default form submission behavior
  const formData = new FormData(document.getElementById('dynamicForm'));
  const data = Object.fromEntries(formData.entries());
  const collectionName = document.getElementById('collectionSelect').value;

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
