### Description

This app uses allows to record audio files or to extract audio from youtube videos.

A transcript is generated including a summary of the files, and all the main entities (the most significant words) are highlighted.

All entities are then listed and it's possible to get information and insight from the web.

### Dependencies

This app is using various dependencies and services for storing files, conversion and audio files tweaking.
Google speech to text API, Google Storage, youtube_dl, ffmpeg, pydub, Wikipedia API, Spacy and NLTK for NLP.

### Installation

Clone the project with: `git clone <ProjectName>` 
Install its dependencies: `pip install -r requirements.txt` 
Install the frontend dependencies in thr frontend folder: `npm install`.
Run `python3 app.py` to start the app.

#### Notes

The frontend is using a modified version of a npm module called `react-audio-recorder` to record audio in wav format natively as opposed to webm, which are not supported by the Google's API: `https://github.com/danrouse/react-audio-recorder`

The default spacy model can be overwitten with a custom built model.
To train it, you can use various tool. We used: `https://github.com/ManivannanMurugavel/spacy-ner-annotator`

#### Development
Create authentication credentials for google cloud at `https://cloud.google.com/docs/authentication/getting-started`

Activate the speech to text Google API: `https://console.developers.google.com/apis/api/speech.googleapis.com/overview?project=194319293812`

To upload files to the Google cloud storage, refer to the following documentation:
`https://cloud.google.com/storage/docs/uploading-objects`

To use the speech to text API after activation, refer to the following link:
`https://cloud.google.com/speech-to-text/docs/`

#### Deployment:
`gcloud app deploy --project deep-lingua`