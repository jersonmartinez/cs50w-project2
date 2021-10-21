import os
import json
from flask import Flask, render_template, request, session, redirect
from flask_session import Session
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SECRET_KEY'] = 'secret'
Session(app)

socketio = SocketIO(app)

# Cargamos la plantilla HTML con el frontend.
@app.route('/')
def index():
    return render_template('index.html')

# Recibirá los nuevos mensajes y los emitirá por socket.
@socketio.on('message') # recibir msj del lado del cliente al servidor (EVENTO) . 
def handle_Message(msg): # Comenzamos a manejar el msj.
    print('Mensaje: ' + msg) #mensaje en terminal.
    send(msg, broadcast = True) #mensaje al lado del cliente con su transmision.

# Iniciamos
if __name__ == '__main__':
    socketio.run(app)