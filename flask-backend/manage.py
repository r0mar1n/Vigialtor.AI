import subprocess
import time
import os
import signal

def start_api(script_name):
    """
    Start the API script in the background.
    """
    print(f"Starting {script_name}...")
    command = f"python {script_name}"  # Use 'python' instead of 'python3' on Windows
    process = subprocess.Popen(
        command,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
    )
    return process

def stop_api(process):
    """
    Stop the API process.
    """
    print(f"Stopping process with PID {process.pid}...")
    process.send_signal(signal.CTRL_BREAK_EVENT)

if __name__ == "__main__":
    api_scripts = [
        "trancocheck.py",
        "app.py",
        "content.py",
        "central_api.py"
    ]

    processes = []

    for script in api_scripts:
        process = start_api(script)
        processes.append(process)
        time.sleep(2)  # Optional: slight delay between starting APIs

    print("All APIs started!")

    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("Shutting down all APIs...")
        for process in processes:
            stop_api(process)
