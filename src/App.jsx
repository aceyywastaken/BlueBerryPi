// App.jsx
import React, { useState, useEffect } from "react";
import UI from "./Ui.jsx";

export default function App() {
  const [piConfig, setPiConfig] = useState({
    PI_HOST: "",
    PI_USER: "",
    PI_PASS: ""
  });
  const [loggedIn, setLoggedIn] = useState(false);

  // Load last saved config from backend
  useEffect(() => {
    fetch("/BlueBerryKey.json")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("No saved config found");
      })
      .then(data => setPiConfig(data))
      .catch(() => {
        // Defaults if no file exists
        setPiConfig({
          PI_HOST: "10.0.33.216",
          PI_USER: "anzen",
          PI_PASS: "raspberry"
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPiConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("/set_config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(piConfig),
      });
      const data = await res.json();
      if (data.status === "success") {
        setLoggedIn(true);
      } else {
        alert("Failed to save Pi config.");
      }
    } catch (err) {
      alert("Error connecting to backend: " + err.message);
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#2b2b2b" }}>
        <div style={{ background: "#333", padding: "30px", borderRadius: "10px", color: "#fff", minWidth: "300px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login to Pi</h2>
          <label>Pi IP:</label>
          <input
            type="text"
            name="PI_HOST"
            value={piConfig.PI_HOST}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "none" }}
          />
          <label>Username:</label>
          <input
            type="text"
            name="PI_USER"
            value={piConfig.PI_USER}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "none" }}
          />
          <label>Password:</label>
          <input
            type="password"
            name="PI_PASS"
            value={piConfig.PI_PASS}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "none" }}
          />
          <button
            onClick={handleLogin}
            style={{ width: "100%", padding: "10px", marginTop: "15px", borderRadius: "8px", background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <UI piConfig={piConfig} />;
}
