from transformers import AutoProcessor, AutoModelForCTC
import torch
import soundfile as sf
import os


MODEL_NAME = "iamTangsang/Wav2Vec2_XLS-R-300m_Nepali_ASR"
MODEL_DIR = "./models"

processor = AutoProcessor.from_pretrained(MODEL_NAME, cache_dir=MODEL_DIR)
model = AutoModelForCTC.from_pretrained(MODEL_NAME, cache_dir=MODEL_DIR)

def transcribe_audio(audio_path):
   
    audio, sampling_rate = sf.read(audio_path)

    # Ensure the audio is sampled at 16 kHz
    if sampling_rate != 16000:
        raise ValueError("Audio must be sampled at 16 kHz.")

    # Preprocess audio
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)

    # Forward pass through the model
    with torch.no_grad():
        logits = model(inputs.input_values).logits

    # Decode the predictions
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)

    return transcription[0]
