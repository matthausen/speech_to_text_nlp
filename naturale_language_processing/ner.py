import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk
from nltk.chunk import conlltags2tree, tree2conlltags
from pprint import pprint
import spacy
from spacy import displacy
from collections import Counter
from bs4 import BeautifulSoup
import requests
import re


def list_entities(text_file, model):
  
  entity_list = {}
  
  if (model == 'default'):
    try:
      nlp = en_core_web_sm.load()

      ny_bb = text_file

      default_entities = nlp(ny_bb)
      len(default_entities.ents)

      default_labels = [x.label_ for x in default_entities.ents]
      dl = tuple(default_labels)

      default_dictionary = dict(zip(default_entities.ents,dl))

      entity_list = default_dictionary
      print(entity_list)
    except:
      print('An exception occured at the entity extraction level')

  if (model == 'enhanced'):

    # nlp = en_core_web_sm.load()
    nlp = spacy.load('en_core_web_sm')
    nlp2 = spacy.load('lingua')
    nlp2.add_pipe(nlp2.create_pipe('sentencizer'))

    ny_bb = text_file

    default_entities = nlp(ny_bb)
    custom_entities = nlp2(ny_bb)

    default_labels = [x.label_ for x in default_entities.ents]
    custom_labels = [x.label_ for x in custom_entities.ents]
    
    default_text = [x.text for x in default_entities.ents]
    custom_text = [x.text for x in custom_entities.ents]

    dt = tuple(default_text)
    ct = tuple(custom_text)

    dl = tuple(default_labels)
    cl = tuple(custom_labels)

    # Add quotes and make a dictionary entity - label
    default_dictionary = dict(zip(dt,dl))
    custom_dictionary = dict(zip(ct,cl))
    entity_list = {**default_dictionary, **custom_dictionary}

  return entity_list

# Use this function if you want to return plain html to the UI

def extract_entities(text_file, model):
  # Switch between models
  nlp = spacy.load('en_core_web_sm')
  if(model and model == 'default' or model == ''):
    nlp = spacy.load('en_core_web_sm')
  if(model and model == 'enhanced'):
    nlp = spacy.load('lingua')
    nlp.add_pipe(nlp.create_pipe('sentencizer'))

  ny_bb = text_file
  text_file = nlp(ny_bb)
  len(text_file.ents)

  labels = [x.label_ for x in text_file.ents]
  Counter(labels)

  items = [x.text for x in text_file.ents]
  Counter(items).most_common(3)

  sentences = [x for x in text_file.sents]

  [(x.orth_,x.pos_, x.lemma_) for x in [y 
                                    for y
                                    in nlp(str(sentences[0])) 
                                    if not y.is_stop and y.pos_ != 'PUNCT']]

  dict([(str(x), x.label_) for x in nlp(str(sentences[0])).ents])

  """ colors = {
    "GPE": "linear-gradient(90deg, #aa9cfc, #fc9ce7)",
    "CARDINAL" : "linear-gradient(90deg, #3A4983, #3B1486)"
    }
  options = {"ents": ["GPE", "CARDINAL"], "colors": colors} """

  html = displacy.render(text_file, page=True, style='ent') # Add options here to change colors

  return html