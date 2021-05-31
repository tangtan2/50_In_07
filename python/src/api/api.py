import numpy as np
from flask import Flask, request
import pickle

app = Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    return 'Make a prediction!'


@app.route('/classification_svm', methods=['POST'])
def classification_svm():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = classification_svm.predict(feature_values)
    return prediction


@app.route('/classification_rf', methods=['POST'])
def classification_rf():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = classification_rf.predict(feature_values)
    return prediction


@app.route('/regression_en', methods=['POST'])
def regression_en():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = regression_en.predict(feature_values)
    return prediction


@app.route('/regression_mlp', methods=['POST'])
def regression_mlp():
    feature_values = [np.array(request.form['feature_values'])]
    prediction = regression_mlp.predict(feature_values)
    return prediction


if __name__ == '__main__':
    classification_svm = pickle.load(open('models/classification_pipeline_svm.pkl', 'rb'))
    classification_rf = pickle.load(open('models/classification_pipeline_rf.pkl', 'rb'))
    regression_en = pickle.load(open('models/regression_pipeline_en.pkl', 'rb'))
    regression_mlp = pickle.load(open('models/regression_pipeline_mlp.pkl', 'rb'))
    app.run(debug=True)
