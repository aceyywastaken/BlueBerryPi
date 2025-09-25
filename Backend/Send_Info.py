from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko

app = Flask(__name__)
CORS(app)

# Pi SSH configuration
PI_HOST = "10.0.33.216"   # Replace with your Pi's IP
PI_PORT = 22
PI_USER = "anzen"             # Replace with your Pi username
PI_PASS = "raspberry"      # Replace with your Pi password (or use key auth)

# Format CAN data for sending
def format_can_data(code):
    if not code:
        return ""
    # Remove spaces and dots
    code = code.replace('.', '').replace(' ', '').strip()
    # Keep only hex digits
    code = ''.join(c for c in code if c in '0123456789ABCDEFabcdef')
    # Limit to 8 bytes (16 hex characters)
    code = code[:16]
    # Pad with zeros if shorter than 16
    return code.ljust(16, '0').upper()

# Function to run a command via SSH
def run_ssh_command(cmd):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(PI_HOST, port=PI_PORT, username=PI_USER, password=PI_PASS)
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        ssh.close()
        if err:
            return False, err
        return True, out
    except Exception as e:
        return False, str(e)

@app.route("/send_command", methods=["POST"])
def send_command():
    data = request.get_json()
    code = data.get("code")
    if not code:
        return jsonify({"status": "error", "message": "No code provided"}), 400

    formatted = format_can_data(code)
    cmd = f"cansend can0 1890E8CC#{formatted}"

    success, output = run_ssh_command(cmd)
    if success:
        return jsonify({"status": "success", "cmd": cmd, "output": output})
    else:
        return jsonify({"status": "error", "message": output}), 500

@app.route("/clear_command", methods=["POST"])
def clear_command():
    data = request.get_json()
    code = data.get("code")
    if not code:
        return jsonify({"status": "error", "message": "No code provided"}), 400

    formatted = format_can_data(code)
    cmd = f"cansend can0 1891E8CC#{formatted}"

    success, output = run_ssh_command(cmd)
    if success:
        return jsonify({"status": "success", "cmd": cmd, "output": output})
    else:
        return jsonify({"status": "error", "message": output}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
