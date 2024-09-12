from flask import Flask, render_template, request, jsonify

from chat import get_response

import sqlite3

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
app = Flask(__name__)



@app.get("/" )
def index_get():
    return render_template("base.html")

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/product')
def product():
    return render_template('product.html')

@app.route('/testimonials')
def testimonials():
    return render_template('testimonials.html')


@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    # TODO: check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)




#feedback

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({"error": "All fields are required"}), 400

        # Save feedback to the database
        conn = sqlite3.connect('feedback.db')
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL
            )
        ''')
        c.execute('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', (name, email, message))
        conn.commit()
        conn.close()

        return jsonify({"name": name, "message": "Feedback received!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#feedback

if __name__ == "__main__":
    app.run(debug=True)
