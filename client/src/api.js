const baseUrl = window.location.origin;
// const baseUrl = 'http://127.0.0.1:5000';

const URLs = {
  AUDIOURL: `${baseUrl}/api/audio_converter`,
  VIDEOURL: `${baseUrl}/api/video_converter`,
  FILEUPLOAD: `${baseUrl}/api/file-upload`,
  WIKIDATAURL: `${baseUrl}/api/wikidata`,
}
export default URLs;