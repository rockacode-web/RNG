from flask import Flask 
from flask_cors import CORS
app = Flask(__name__)
CORS(app) # type: ignore
from .config import Config

from os import name    
from .functions import DB 
from .mqtt import MQTT  

# Create MongoDB instance to get access to all the functions defined in functions.py
mongo = DB(Config)
Mqtt  = MQTT(mongo)

app.config.from_object(Config) 

from app import views