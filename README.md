Chatbot Deployment with Flask and JavaScript
This gives 2 deployment options:

Deploy within Flask app with jinja2 template
Serve only the Flask prediction API. The used html and javascript files can be included in any Frontend application (with only a slight modification) and can run completely separate from the Flask App then.
Install dependencies

$ (venv) pip install Flask torch torchvision nltk
Install nltk package

$ (venv) python
>>> import nltk
>>> nltk.download('punkt')
Modify intents.json with different intents and responses for your Chatbot

Run

$ (venv) python train.py
This will dump data.pth file. And then run the following command to test it in the console.

$ (venv) python chat.py
Now for deployment follow my tutorial to implement app.py and app.js.

Note
we implement the first approach using jinja2 templates within our Flask app. Only slight modifications are needed to run the frontend separately. I put the final frontend code for a standalone frontend application.

Jadera Jewelry Shop Website Project Title: Jadera Jewellery Shop Website and Chatbot

Project Description: This is a group project aimed at creating a comprehensive online platform for Jadera Jewellery Shop. The project involves two main components:

Website: A user-friendly website built using HTML, CSS, and JavaScript to showcase the jewellery collection, provide product information, and facilitate online purchases. AI Chatbot: An intelligent chatbot powered by NLTK, NLP, and possibly TensorFlow or PyTorch to provide real-time customer support, answer queries, and assist with the purchasing process.

Technologies Used: Frontend: HTML, CSS, JavaScript Backend: (For chatbot integration) NLTK, NLP, TensorFlow/PyTorch
