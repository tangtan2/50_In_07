from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
model = pickle.load(open('model/model.pkl', 'rb'))


@app.route('/')
def home():
    return 'Make a prediction!'
