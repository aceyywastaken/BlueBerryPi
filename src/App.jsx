import React, { useState } from "react";
import { MdStart } from "react-icons/md";
import { RiDeleteBack2Line } from "react-icons/ri";
import { CgDanger } from "react-icons/cg";
import { SlMenu, SlInfo, SlMinus } from "react-icons/sl";

const BACKEND_URL = "http://10.0.15.182:5000";

const buttonConfigs = [
  { label: "BPUV", code: "01.01.00.00", description: "BMS power supply exceeded low limits" },
  { label: "BPOV", code: "01.02.00.00", description: "BMS Power Supply Exceeded High Limit" },
  { label: "M800 over temperature", code: "01.04.00.00", description: "BMS temperature exceeded high limits" },
  { label: "BPUV", code: "01.08.00.00", description: "System voltage exceeded low limits" },
  { label: "BPOV", code: "01.10.00.00", description: "System Voltage Exceeded High Limit" },
  { label: "Discharge Current At High Limit", code: "01.00.01.00", description: "Discharge current exceeded high limits" },
  { label: "Over Temperature(charge)", code: "01.00.80.00", description: "Battery temperature exceeded high limits during charge. Check terminal connection. Replace battery if necessary." },
  { label: "Over Temperature(discharge)", code: "01.00.00.02.00", description: "Battery Temperature Exceeded High Limit during Discharge. Check Terminal Connection. Replace Battery if necessary." },
  { label: "SBUV", code: "01.00.00.00.40", description: "Single battery voltage lower than minimum operating voltage. Confirm BMS voltage. Replace battery if confirmed." },
  { label: "SBOV", code: "01.00.00.00.80", description: "Single battery voltage higher than maximum operating voltage" },
  { label: "BPUV", code: "02.08.00.00.00", description: "System voltage at low limits" },
  { label: "Discharge Current At High Limit", code: "02.00.01.00", description: "Discharge current at high limits" },
  { label: "Over Temperature(charge)", code: "02.00.80.00", description: "Battery temperature at high limits during charge" },
  { label: "Contactor temperature", code: "02.00.00.00.10", description: "System temperature #2 too high – the contactor temperature exceeded 150°C" },
  { label: "Diode temperature", code: "02.00.00.00.20", description: "System temperature #1 too high – the charge blocking diode temperature exceeded 100°C" },
  { label: "BPUV", code: "03.08.00.00.00", description: "System voltage close to low limits" },
  { label: "BPOV", code: "03.10.00.00.00", description: "System voltage close to high limits" },
  { label: "Low temperature when charging", code: "03.00.00.01.00", description: "Battery temperature close to low limits for charging" },
  { label: "Over Temperature(discharge)", code: "03.00.00.02.00", description: "Battery Temperature Close to High Limit during Discharge" },
  { label: "SBOV", code: "03.00.00.00.80", description: "Single battery voltage above 15.5V" },
  { label: "ADah", code: "04.01.00.", description: "System 50% overcharge error" },
  { label: "ADAh", code: "04.02.00.", description: "Charge completed below lower voltage threshold. System undercharged" },
  { label: "Low OCV", code: "04.00.08.", description: "Single battery low OCV. Confirm BMS voltage. Replace battery if confirmed" },
  { label: "SPU Communication Loss", code: "04.00.10", description: "SPU lost communication. Check CAN connections" },
  { label: "Contactor stuck closed in StandBy", code: "04.00.20", description: "Contactor stuck closed. Fix issue, reset BMS required" },
  { label: "Over Current When Fast Charge", code: "04.00.40", description: "Charge current exceeded high limits. Fix issue, reset BMS required" },
  { label: "Charge Current At High Limit", code: "04.00.80", description: "Fast Charge Current At High Limit" }
];



export default function App() {
  const [log, setLog] = useState([]);
  const [expanded, setExpanded] = useState({});

  const logMessage = (message) => setLog(prev => [...prev, message]);

  const sendCommand = async (code) => {
    try {
      const res = await fetch(`${BACKEND_URL}/send_command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      logMessage(res.ok ? `[SENT] ${data.cmd}` : `[ERROR] ${data.message}`);
    } catch (err) {
      logMessage(`[ERROR] ${err.message}`);
    }
  };

  const clearCommand = async (code) => {
    try {
      const res = await fetch(`${BACKEND_URL}/clear_command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      logMessage(res.ok ? `[CLEARED] ${data.cmd}` : `[ERROR] ${data.message}`);




    } catch (err) {
      logMessage(`[ERROR] ${err.message}`);
    }
  };

  const clearAllCodes = async () => {
    for (let btn of buttonConfigs) {
      await clearCommand(btn.code);
    }
  };

  const getColor = (code) => {
    if (code.startsWith("01")) return "rgba(200,50,50,0.85)";
    if (code.startsWith("02")) return "rgba(220,120,50,0.85)";
    if (code.startsWith("03")) return "rgba(220,200,50,0.85)";
    return "rgba(100,100,100,0.85)";
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#2b2b2b", color: "#fff" }}>
      <div style={{ flex: 1, padding: "25px", overflowY: "auto" }}>
        {buttonConfigs.map((btn, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "18px 20px",
              background: getColor(btn.code),
              borderRadius: "12px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
              transition: "all 0.2s ease-in-out",
              color: "#fff",
              marginBottom: "16px"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Trigger Button */}
            <button
              onClick={() => sendCommand(btn.code)}
              style={{
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                transition: "all 0.2s ease-in-out"
              }}
            >
              <MdStart style={{ marginRight: "7px" }} /> Trigger
            </button>

            {/* Label + Info Dropdown */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "Segoe UI, sans-serif",
                  minHeight: "45px",
                }}
                onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
              >
                <span>{btn.label}</span>
                {expanded[i] ? <SlMinus /> : <SlInfo />}
              </div>
              <div
                style={{
                  maxHeight: expanded[i] ? "500px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  marginTop: expanded[i] ? "8px" : "0px",
                  color: "#ddd",
                  padding: expanded[i]? "6px 0 0 0" : "0"
                }}
              >
                {btn.description} <span style={{ color: "#ccc" }}>({btn.code})</span>
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => clearCommand(btn.code)}
              style={{
                background: "#bf3e3e",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                transition: "all 0.2s ease-in-out"
              }}
            >
              <RiDeleteBack2Line /> Clear
            </button>
          </div>
        ))}

        {/* Clear All Codes Button */}
        <button
          onClick={clearAllCodes}
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "14px",
            background: "#bf3e3e",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
            transition: "all 0.2s ease-in-out"
          }}
        >
          <CgDanger /> Clear All Codes <CgDanger />
        </button>
      </div>

      <ActivityLog log={log} setLog={setLog} />
    </div>
  );
}

function ActivityLog({ log, setLog }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      width: open ? "320px" : "35px",
      transition: "width 0.3s",
      background: "rgba(50,50,50,0.95)",
      overflowY: "auto",
      borderRadius: "12px",
      padding: open ? "10px" : "0"
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: "10px",
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      >
        {open && <h3 style={{ margin: 0 }}>Activity Log</h3>}
        <SlMenu style={{ fontSize: "20px" }} />
      </div>

      {open && (
        <div style={{ padding: "0 10px 10px 10px" }}>
          {log.length ? log.map((msg, i) => <div key={i} style={{ marginBottom: "6px" }}>{msg}</div>) : <div>No activity yet.</div>}
          <button
            onClick={() => setLog([])}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "12px",
              background: "#bf3e3e",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              transition: "all 0.2s ease-in-out"
            }}
          >
            Clear log
          </button>
        </div>
      )}
    </div>
  );
          }
