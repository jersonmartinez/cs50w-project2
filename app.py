import os
import json
from flask import Flask, render_template, request, session, redirect
from flask_session import Session

app = Flask(__name__)

Dict_Phrases = [
    {'Seas quien seas, hagas lo que hagas, cuando deseas con firmeza alguna cosa es porque este deseo nació en el alma del universo.':'El Alquimista (Paulo Coelho)'},
    {'No todo lo que es de oro reluce, ni toda la gente errante anda perdida':'El Señor de los Anillos (J.R.R. Tolkien)'}
]

@app.route('/')
def index():
    return render_template("index.html", len = len(Dict_Phrases), Dict_Phrases = Dict_Phrases)

@app.route("/create_group", methods=['POST'])
def create_group():

if __name__ == '__main__':
    app.run(debug=True)