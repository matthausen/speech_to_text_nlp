const baseUrl = (window.location.origin === 'http://localhost:3000') ? 'http://127.0.0.1:5000' : window.location.origin

const URLs = {
  AUDIOURL: `${baseUrl}/api/audio_converter`,
  VIDEOURL: `${baseUrl}/api/video_converter`,
  FILEUPLOAD: `${baseUrl}/api/file-upload`,
  WIKIDATAURL: `${baseUrl}/api/wikidata`,
}
export default URLs;