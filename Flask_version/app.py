from flask import render_template, Flask, request 
import json

app = Flask(__name__)

@app.route('/')
def hello(name=None):
    return render_template('index.html', name=name)

@app.route('/save', methods=['POST'])
def foo():
    if request.method == "POST":
        with open('data.json', 'w') as outfile:
            json.dump(json.loads(request.form['data']), outfile)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}