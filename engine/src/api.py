from flask import request
from engine.manage import app
from flask import Blueprint

api = Blueprint('api', __name__)

@api.route('/recommend/<str:userId>', methods=['GET'])
def get_recommendations(userId):
    count = request.args.get('count', 10)
    # db.getMovieIds(userId)
    # predictionIds = engine.predict(userId, count)
    # return predictionIds
    pass


app.register_blueprint(api)