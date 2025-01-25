from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.transcription import transcribe_audio
from utils.audio_utils import record_audio

app = Flask(__name__)
CORS(app)  
@app.route("/record", methods=["POST"])
def record():
    file_name = "recordings/input.wav"
    duration = request.json.get("duration", 5)
    record_audio(file_name, duration)
    return jsonify({"message": "Recording finished", "file_name": file_name})

@app.route("/transcribe", methods=["POST"])
def transcribe():
    file_name = request.json.get("file_name")
    transcription = transcribe_audio(file_name)
   # print(transcription)
    return jsonify({"transcription": transcription})


if __name__ == "__main__":
    app.run(debug=True)
