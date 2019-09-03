from flask import request, Blueprint, jsonify
from . import model
import tensorflow as tf

graph = tf.get_default_graph()

api = Blueprint('api', __name__)

@api.route('/recommend/<int:userId>', methods=['GET'])
def get_recommendations(userId):
    count = request.args.get('count', 200)
    with graph.as_default():
        results = model.predict(int(userId), int(count))
        # results = model.predict(50, 50)
        print(results)
        return jsonify(results)

@api.route('/', methods=['GET'])
def health():
    return jsonify('testing')
