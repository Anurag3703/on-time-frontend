import React, { useState } from "react";
import { parseVoiceCommand } from "../services/api";

// Polyfill for SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function VoiceInput({ userEmail }) {
  const [transcript, setTranscript] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    try {
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported");
      }
      
      setIsListening(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        console.log("Voice recognition started");
      };
      
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceCommand(text);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition error: ";
        
        switch(event.error) {
          case 'network':
            errorMessage += "Network connection issue. Please check your internet connection.";
            break;
          case 'not-allowed':
            errorMessage += "Microphone access denied. Please allow microphone access in your browser settings.";
            break;
          case 'aborted':
            errorMessage += "Recognition was aborted.";
            break;
          case 'audio-capture':
            errorMessage += "Could not detect microphone. Please check your device.";
            break;
          case 'no-speech':
            errorMessage += "No speech detected. Please try again.";
            break;
          default:
            errorMessage += event.error;
        }
        
        alert(errorMessage);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log("Voice recognition ended");
      };
      
      // Add a small timeout to ensure network is ready
      setTimeout(() => {
        recognition.start();
      }, 300); // 300ms delay to help prevent network errors
    } catch (error) {
      console.error("Speech recognition error:", error);
      setIsListening(false);
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleVoiceCommand = async (text) => {
    const aiResult = await parseWithAI(text);
    if (aiResult) {
      // Map universityName to title for the frontend
      const mappedResult = {
        ...aiResult,
        title: aiResult.universityName
      };
      setParsedData(mappedResult);
      setShowModal(true);
    } else {
      alert("Sorry, I couldn't understand your command.");
    }
  };

  const parseWithAI = async (text) => {
    try {
      return await parseVoiceCommand(text);
    } catch (error) {
      console.error("AI parsing error:", error);
      return null;
    }
  };

  const sendDeadline = async () => {
    try {
      if (!userEmail) {
        alert("Please sign in first to add a deadline.");
        return;
      }
      
      // Create the data structure expected by the backend
      const backendData = {
        universityName: parsedData.title,
        startDate: parsedData.startDate,
        endDate: parsedData.endDate,
        notes: parsedData.notes || "",
        user: {
          email: userEmail
        }
      };
      
      console.log("Sending data to backend:", backendData);
      
      const res = await fetch("http://localhost:8081/api/deadlines/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(backendData),
      });

      if (res.ok) {
        alert("Deadline added!");
        setTranscript("");
        setShowModal(false);
        setTimeout(() => setParsedData(null), 3000);
      } else {
        // Try to get more detailed error message
        const errorText = await res.text();
        console.error("Server error:", errorText);
        alert(`Failed to add deadline. ${errorText || "Please try again."}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to connect to server.");
    }
  };

  const cancelPreview = () => {
    setParsedData(null);
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setParsedData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <span>
      <button 
        onClick={startListening} 
        className="add-deadline-btn-large"
        disabled={isListening}
      >
        🎤 Add with Voice
      </button>
      
      {isListening && (
        <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
          Listening...
        </div>
      )}
      
      {transcript && !isListening && (
        <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
          Transcript: {transcript}
        </div>
      )}

      {showModal && parsedData && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Edit & Confirm Deadline</h3>
            <label>Title:</label>
            <input
              type="text"
              value={parsedData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              style={inputStyle}
            />

            <label>Start Date:</label>
            <input
              type="date"
              value={parsedData.startDate || ""}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              style={inputStyle}
            />

            <label>End Date:</label>
            <input
              type="date"
              value={parsedData.endDate || ""}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              style={inputStyle}
            />

            <label>Notes:</label>
            <textarea
              value={parsedData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <div style={{ marginTop: "15px" }}>
              <button onClick={sendDeadline} style={confirmButtonStyle}>✅ Confirm</button>
              <button onClick={cancelPreview} style={cancelButtonStyle}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}

// Basic Modal Styles (unchanged)
const modalStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
  maxWidth: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const confirmButtonStyle = {
  marginRight: "10px",
  padding: "8px 16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default VoiceInput;