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

channels = dict()

# Cargamos la plantilla HTML con el frontend.
@app.route('/')
def index():
    if 'username' in session:
        return render_template('dashboard.html')
    else:
        return render_template('layout.html', username=session['username'])

@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('login_username')
        session['username'] = username
        print(f"Username: {username}")
        return redirect("/")

@socketio.on('connect')
def connect():
    print('Client connected')

@socketio.on('getchannel')
def getChannel(msg): 
    print('Canal: ' + msg)
    emit('getchannel', msg, broadcast = True)

@socketio.on('message')
def handle_Message(msg):
    data = dict(username=session['username'], message=msg['message'], channel=msg['channel'], time_hour_minute=msg['time_hour_minute'])
    print('Message: ' + data['channel'])
    send(data, broadcast = True)


@app.route("/logout")
def logout():
    session.clear()
    return render_template('layout.html')

# Iniciamos
if __name__ == '__main__':
    socketio.run(app)