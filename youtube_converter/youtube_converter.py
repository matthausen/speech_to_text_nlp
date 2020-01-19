from __future__ import unicode_literals
import os
import youtube_dl
import time


def convert(url):
  ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'wav',
        'preferredquality': '192',
    }],
    'outtmpl': 'video.wav', #'%(title)s.%(etx)s'
    'quiet': False
  }

  with youtube_dl.YoutubeDL(ydl_opts) as ydl:
      ydl.download([url])
      time.sleep(10)
      os.system('ffmpeg -i video.wav -ac 1 video_mono.wav')  

# Alternative to convert youtube video to audio
''' 
  video_name = 'youtube_video.wav'
  if(video_url):
    os.system(f'python3 -m youtube_dl --restrict-filenames -f bestaudio[asr=44100] --ignore-errors --output {video_name} -x --audio-format wav {video_url}')
'''