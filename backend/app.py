from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin

import os
app = Flask(__name__, static_url_path='')
CORS(app)
app.config.setdefault('MONGO_URI', os.getenv('MONGO_URI'))
app.config.from_object('config.BaseConfig')


mongo = PyMongo(app)
