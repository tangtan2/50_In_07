# 50 in '07: Predictive Analytics for the Maple Leafs

This project involves using historical data scraped from the public NHL API to make goal predictions for players on the Maple Leafs. Click [here](https://50in0seven.ca) to see these models in action, as well as browse through some data visualizations of various statistics. You will be able to make your own predictions of goal success in a simulated game state!

### Background

---

I was introduced to hockey and the NHL about 3 years ago and after some time of just watching games, I began to wonder about how data might be used to make predictions about game plays. Luckily for me, the NHL actually exposes their API to the public and it contains a plethora of data (including data about every single play of every single game!). So I decided to try and use that data and implement two types of machine learning models: binary classification for predicting goal success and regression for predicting the number of goals scored. 

#### Model: Binary Classification

---

Used parameters such as play location and player statistics to predict whether or not a certain shot will reach the inside of the net and gain a point for the Leafs. Random Forest and Support Vector Machine models were implemented. 

#### Model: Regression

---

Used parameters such as player and game statistics to predict how many goals a player would score during a specific game. Elastic-Net and Multi-Layer Perceptron regression models were implemented. 
