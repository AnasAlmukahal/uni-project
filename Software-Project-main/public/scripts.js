document.addEventListener('DOMContentLoaded', () => {
  fetchCollections();
  initializeKPIButton();
  initializeGraphButton();
  initializeMilestoneButton();
  initializeFeedbackButton();
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
  event.preventDefault(); 
  const formData = new FormData(document.getElementById('dynamicForm'));
  const data = Object.fromEntries(formData.entries());
  const collectionName = document.getElementById('collectionSelect').value;

  axios.post(`http://127.0.0.1:5500/api/collection-data/${collectionName}`, data)
    .then(response => {
      alert('Data submitted successfully!');
      fetchCollectionData(collectionName);
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
//-----KPI-----------
function initializeKPIButton() {
  document.getElementById('generateKPIButton').addEventListener('click', generateKPIChart);
}
async function generateKPIChart() {
  const collectionName = document.getElementById('collectionSelect').value;
  if (!collectionName) {
    alert('Please select a collection');
    return;
  }

  try {
    const response = await axios.get(`http://127.0.0.1:5500/api/kpi/${collectionName}`);
    const contentType = response.headers['content-type'];

    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML instead of JSON:', response.data);
      alert('Unexpected HTML response. Check the server endpoint.');
      return;
    }

    const kpiData = response.data;
    console.log('Received KPI Data:', kpiData);

    if (!kpiData || Object.keys(kpiData).length === 0) {
      alert('Invalid KPI data received');
      return;
    }

    const ctx = document.getElementById('kpiChart').getContext('2d');

   
    if (window.kpiChartInstance) {
      window.kpiChartInstance.destroy();
    }

    // create new chart
    window.kpiChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Collection Retrieval Time', 'Document Fetch Time', 'Form Submission Rate', 'API Error Rate'],
        datasets: [{
          label: 'KPI Values',
          data: [
            kpiData.collectionRetrievalTime,
            kpiData.documentFetchTime,
            kpiData.formSubmissionRate,
            kpiData.apiErrorRate
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching KPI data:', error);
    alert('Error fetching KPI data');
  }
}

//------------graph output-------------

document.getElementById('dynamicForm').addEventListener('submit', submitForm);
function initializeGraphButton() {
  document.getElementById('generateGraphButton').addEventListener('click', generateGraphFromForm);
}

function generateGraphFromForm() {
  const formData = new FormData(document.getElementById('dynamicForm'));
  const data = Object.fromEntries(formData.entries());

  if (Object.keys(data).length === 0) {
    alert('No data to graph. Please submit data first.');
    return;
  }

  generateGraphOutput(data);
}
let currentChart = null; 

async function generateGraphOutput() {
  const collectionName = document.getElementById('collectionSelect').value;
  if (!collectionName) {
      alert('Please select a collection first.');
      return;
  }

  try {
      const response = await axios.get(`/api/graph/${collectionName}`);
      const data = response.data;

      if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format');
      }

      const labels = Object.keys(data);
      const values = Object.values(data);

      const ctx = document.getElementById('dataGraph').getContext('2d');


      if (window.dataGraphChart) {
          window.dataGraphChart.destroy();
      }


      window.dataGraphChart = new Chart(ctx, {
          type: 'bar', 
          data: {
              labels: labels,
              datasets: [{
                  label: 'Data Values',
                  data: values,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false, 
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
  } catch (error) {
      console.error('Error generating graph data:', error);
      alert('Error generating graph data');
  }
}
//generate graph output

document.getElementById('generateGraphButton').addEventListener('click', generateGraphOutput);


//get data for graph
async function fetchGraphData(collectionName) {
  try {
      const response = await fetch(`/api/graph/${collectionName}`);
      const data = await response.json();
      if (Object.keys(data).length === 0) {
          console.error('No data to graph.');
          return;
      }
      generateGraph(data);
  } catch (error) {
      console.error('Error fetching graph data:', error);
  }
}


document.getElementById('generateGraphButton').addEventListener('click', () => {
  const collectionName = document.getElementById('collectionSelect').value;
  if (collectionName) {
      fetchGraphData(collectionName);
  } else {
      console.error('No collection selected.');
  }
});

//milestone
function initializeMilestoneButton() {
  document.getElementById('generateMilestoneButton').addEventListener('click', generateMilestone);
}

async function generateMilestone() {
  const collectionName = document.getElementById('collectionSelect').value;
  if (!collectionName) {
      alert('Please select a collection');
      return;
  }

  try {
      const response = await axios.get(`/api/milestone/${collectionName}`);
      const milestoneData = response.data;
      console.log('Milestone Data:', milestoneData);

      // Display the milestone data in the UI
      const milestoneContainer = document.getElementById('milestoneContainer');
      milestoneContainer.innerHTML = `
          <h3>Milestone Generated</h3>
          <p>Total Documents: ${milestoneData.totalDocuments}</p>
          <p>Satisfactory Documents: ${milestoneData.satisfactoryDocuments}</p>
          <p>Documents Needing Revision: ${milestoneData.needsRevisionDocuments}</p>
          <p>Satisfaction Percentage: ${milestoneData.satisfactionPercentage}%</p>
      `;

  } catch (error) {
      console.error('Error generating milestone:', error);
      alert('Error generating milestone');
  }
}


//feedback handler
function initializeFeedbackButton() {
  document.getElementById('submitFeedbackButton').addEventListener('click', submitFeedback);
}

async function submitFeedback() {
  const collectionName = document.getElementById('collectionSelect').value;
  const feedbackText = document.getElementById('feedbackInput').value.trim();

  if (!collectionName) {
      alert('Please select a collection');
      return;
  }

  if (!feedbackText) {
      alert('Please enter your feedback');
      return;
  }

  try {
      const response = await axios.post(`http://127.0.0.1:5500/api/submitFeedback`, {
          documentId: collectionName,
          feedbackText: feedbackText,
          submittedBy: 'User', 
      });

      if (response.status === 201) {
          alert('Feedback submitted successfully');
          document.getElementById('feedbackInput').value = ''; 
      } else {
          alert('Error submitting feedback');
      }
  } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
  }
}
