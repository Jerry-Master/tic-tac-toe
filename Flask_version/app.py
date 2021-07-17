from flask import render_template, Flask, request 
import json
from subprocess import run

app = Flask(__name__)

@app.route('/')
def hello(name=None):
    return render_template('index.html', name=name)

@app.route('/save', methods=['POST'])
def save():
    with open('data.json', 'w') as outfile:
        json.dump(json.loads(request.form['data']), outfile)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route('/exe', methods=['GET', 'POST'])
def exe():
    process = run(['make min_max.exe', './min_max.exe'], 
                    stdin =subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    shell=True, cwd='AI_program')
    return json.dumps({}), 200, {'ContentType':'application/json'}

@app.route('/load', methods=['GET'])
def load():
    with open('data.json', 'r') as infile:
        data = json.load(infile)
    return json.dumps(data), 200, {'ContentType':'application/json'}