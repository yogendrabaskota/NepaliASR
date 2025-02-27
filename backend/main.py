from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.transcription import transcribe_audio
from utils.audio_utils import record_audio, stop_recording
import threading

app = Flask(__name__)
CORS(app)

recording_thread = None  # Global variable for threading

@app.route("/record", methods=["POST"])
def record():
    global recording_thread
    file_name = "recordings/input.wav"
    recording_thread = threading.Thread(target=record_audio, args=(file_name,))
    recording_thread.start()
    return jsonify({"message": "Recording started", "file_name": file_name})

@app.route("/stop", methods=["POST"])
def stop():
    stop_recording()
    if recording_thread:
        recording_thread.join()  # Wait for recording to finish
    return jsonify({"message": "Recording stopped", "file_name": "recordings/input.wav"})

@app.route("/transcribe", methods=["POST"])
def transcribe():
    file_name = request.json.get("file_name", "recordings/input.wav")
    transcription = transcribe_audio(file_name)
    return jsonify({"transcription": transcription})

if __name__ == "__main__":
    app.run(debug=True)
