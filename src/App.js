import React, { useState } from "react";
import axios from "axios";
import "./App.css"

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSegmentName("");
    setSchemas([]);
    setSelectedSchema("");
  };

  const handleAddSchema = () => {
    if (selectedSchema && availableSchemas.length > 0) {
      const newSchema = availableSchemas.find(
        (schema) => schema.value === selectedSchema
      );
      setSchemas([...schemas, newSchema]);
      setAvailableSchemas(
        availableSchemas.filter((schema) => schema.value !== selectedSchema)
      );
      setSelectedSchema("");
    }
  };

  const handleSubmit = () => {
    const payload = {
      segment_name: segmentName,
      schema: schemas.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };
  
    // Log the payload to verify it's correct
    console.log('Payload being sent:', payload);
  
    axios
      .post("https://thingproxy.freeboard.io/fetch/https://webhook.site/5c128ab7-107d-4202-88ec-5bc100aeb87e", payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Data sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  };
  

  return (
    <div className="App">
      <button onClick={openPopup}>Save segment</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Save Segment</h3>

            <label>Segment Name:</label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />

            <div className="dropdown-section">
              <div>
              <label className="add-schema">Add schema to segment:</label>
             </div>
             <div className="select-schema">
              <select
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                <option value="">Select Schema</option>
                {availableSchemas.map((schema) => (
                  <option key={schema.value} value={schema.value}>
                    {schema.label}
                  </option>
                ))}
              </select>

              <button onClick={handleAddSchema}>+ Add new schema</button>
              </div>
            </div>

            {<div className="blue-box">
              {schemas.map((schema, index) => (
                <div key={index} className="schema-item">
                  <span>{schema.label}</span>
                </div>
              ))}
            </div>}

            <button onClick={handleSubmit} className="schema-button">Save the segment</button>
            <button onClick={closePopup} className="schema-cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
