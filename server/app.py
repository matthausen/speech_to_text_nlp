import os
import sys

from flask import Flask, render_template, request
from flask_cors import CORS
from flask import jsonify

import json
import validators
import random
import time

from io import BytesIO
from pydub import AudioSegment
from youtube_dl import YoutubeDL
from config import bucket_name, storage_uri
from google.cloud import storage
from speech_to_text import speech_to_text
from naturale_language_processing import summarise
from naturale_language_processing import ner
from youtube_converter import youtube_converter
import wikipedia

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="./credentials.json"

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")

CORS(app, resources={r"/*": {"origins": "*"}})

# Uploads a file to the bucket
def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print('File {} uploaded to {}.'.format(
        source_file_name,
        destination_blob_name))

# Convert file to WAV format
def convert_to_wav(file):
  sound = AudioSegment.from_file(file)
  # Set width to 2 = 16 bit per sample
  sound = sound.set_channels(1).set_sample_width(2)
  sound.export("uploaded_mono.wav", format="wav")

@app.route("/",methods=['GET', 'POST'])
def index():
  return render_template('index.html')

@app.route("/api/audio_converter",methods=['GET', 'POST'])
def audio_converter():

    if request.method == 'POST':
        print(f'POST request, {request.data} forwarded')

        audio_file = request.data
        model = ''
        #model = request.data.decode('UTF-8')

        # Generate the WAV audio file from byte array with a random name
        file_name = "audio_mono"
        if(audio_file):
            #for x in range(8):
                #file_name += str(random.randint(1,9)) 

            if not os.path.exists(f'{file_name}.wav'):
                with open(f'{file_name}.wav', mode='bx') as f:
                    f.write(audio_file)
                time.sleep(3)
                # Convert Stereo to mono
                sound = AudioSegment.from_wav(f'{file_name}.wav')
                sound = sound.set_channels(1)
                sound.export(f'{file_name}.wav', format="wav")

                source_file_name = f.name
                destination_blob_name = f'{file_name}.wav'

            # Upload the audio file to Google bucket
            source_file_name = f'{file_name}.wav'
            destination_blob_name = f'{file_name}.wav'
            upload_blob(bucket_name, source_file_name, destination_blob_name)

        # Transcribe the audio file to text
        text_file = speech_to_text.sample_long_running_recognize(storage_uri, destination_blob_name)
        
        # Summarize the returned text
        summary = summarise.summarise(text_file)

        # Performs named entity recognition with spacy
        extracted_entities = ner.extract_entities(text_file, model)

        # Return list of entities to the UI
        entity_list = str(ner.list_entities(text_file, model))
        wiki_list = entity_list[1:-1].split(",")

        # Return original text and summary to the UI
        context = { 
            "summary": summary,
            "text": text_file,
            "highlights": extracted_entities,
            "entities": wiki_list,
        }

        return context

@app.route("/api/video_converter",methods=['GET', 'POST'])
def video_converter():

    if request.method == 'POST':

      # Remove previous audio file if existing
      if os.path.exists('video.wav') or os.path.exists('video_mono.wav'):
        try:
          os.remove('video.wav')
          os.remove('video_mono.wav')
          print('Files removed')
        except FileNotFoundError:
          print('No file found')

      data = json.loads(request.data)

      video_url = ''
      model = ''

      for key in data:
          if(validators.url(data[key])):
              video_url = data[key]
          else:
              model = data[key]
      
      # Convert file 
      youtube_converter.convert(video_url)
      audio_file = 'video_mono.wav'

      # Upload the audio file to Google bucket
      source_file_name = audio_file
      destination_blob_name = audio_file
      upload_blob(bucket_name, source_file_name, destination_blob_name)

      # Transcribe the audio file to text
      text_file = speech_to_text.sample_long_running_recognize(storage_uri, destination_blob_name)
      
      # Summarize the returned text
      summary = summarise.summarise(text_file)

      # Performs named entity recognition with spacy
      extracted_entities = ner.extract_entities(text_file, model)

      # Return list of entities to the UI
      entity_list = str(ner.list_entities(text_file, model))
      wiki_list = entity_list[1:-1].split(",")

      # Return original text and summary to the UI
      context = { 
          "summary": summary,
          "text": text_file,
          "highlights": extracted_entities,
          "entities": wiki_list,
      }

      return context

@app.route("/api/file-upload",methods=['GET', 'POST'])
def file_upload():
  if request.method == 'POST':
    # Remove previous audio file if existing
    if os.path.exists('uploaded_mono.wav'):
      try:
        os.remove('uploaded_mono.wav')
        print('Files removed')
      except FileNotFoundError:
        print('No file found')

    uploaded_audio = BytesIO(request.data)
    convert_to_wav(uploaded_audio)
    
    audio_file = 'uploaded_mono.wav'
    model = ''
    
    source_file_name = audio_file
    destination_blob_name = audio_file
    upload_blob(bucket_name, source_file_name, destination_blob_name)

    text_file = speech_to_text.sample_long_running_recognize(storage_uri, destination_blob_name)
    summary = summarise.summarise(text_file)
    extracted_entities = ner.extract_entities(text_file, model)
    entity_list = str(ner.list_entities(text_file, model))
    wiki_list = entity_list[1:-1].split(",")

    # Return original text and summary to the UI
    context = { 
        "summary": summary,
        "text": text_file,
        "highlights": extracted_entities,
        "entities": wiki_list,
    }

    return context

@app.route("/api/wikidata",methods=['GET', 'POST'])
def wikidata():
  if request.method == 'POST':
    data = request.data
    wiki_summary = str(wikipedia.summary(data, sentences=3))
    wiki_article = str(wikipedia.search(data))
    wiki_content = wikipedia.page(data)
    image = str(wiki_content.images[0])
    

    context = {
      "summary": wiki_summary,
      "article": wiki_article,
      "image": image
    }
    
    return context
       
if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)