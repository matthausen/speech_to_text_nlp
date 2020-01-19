import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk
from nltk.chunk import conlltags2tree, tree2conlltags
from pprint import pprint
import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm
from bs4 import BeautifulSoup
import requests
import re


def extract_entities(text_file, model):
  
  # Switch between models
  nlp = en_core_web_sm.load()
  if(model and model == 'default'):
    nlp = en_core_web_sm.load()
  if(model and model == 'biomed'):
    nlp = spacy.load('darwin')
    nlp.add_pipe(nlp.create_pipe('sentencizer'))

  ny_bb = text_file
  text_file = nlp(ny_bb)
  len(text_file.ents)

  labels = [x.label_ for x in text_file.ents]
  Counter(labels)

  items = [x.text for x in text_file.ents]
  Counter(items).most_common(3)

  sentences = [x for x in text_file.sents]
  # print(sentences)
  #displacy.render(nlp(str(sentences[20])), jupyter=True, style='ent')
  #displacy.render(nlp(str(sentences[20])), style='dep', jupyter = True, options = {'distance': 120})
  [(x.orth_,x.pos_, x.lemma_) for x in [y 
                                    for y
                                    in nlp(str(sentences[0])) 
                                    if not y.is_stop and y.pos_ != 'PUNCT']]

  dict([(str(x), x.label_) for x in nlp(str(sentences[0])).ents])
  # print([(x, x.ent_iob_, x.ent_type_) for x in sentences[0]])

  """ colors = {
    "GPE": "linear-gradient(90deg, #aa9cfc, #fc9ce7)",
    "CARDINAL" : "linear-gradient(90deg, #3A4983, #3B1486)"
    }
  options = {"ents": ["GPE", "CARDINAL"], "colors": colors} """

  html = displacy.render(text_file, page=True, style='ent') # Add options here to change colors

  return html


def list_entities(text_file, model):
  
  nlp = en_core_web_sm.load()
  if(model and model == 'default'):
    nlp = en_core_web_sm.load()
  if(model and model == 'biomed'):
    nlp = spacy.load('darwin')
    nlp.add_pipe(nlp.create_pipe('sentencizer'))

  ny_bb = text_file
  text_file = nlp(ny_bb)
  len(text_file.ents)

  # The list of entities in the text
  entity_list = text_file.ents

  return entity_list