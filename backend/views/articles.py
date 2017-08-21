from flask_restful import Resource, fields, marshal_with
from flask import Blueprint, request
from app import mongo
import pymongo
from pymongo import ReturnDocument
from bson.objectid import ObjectId


article_fields = {
    'id': fields.String(attribute='_id'),
    'title': fields.String,
    'link': fields.String,
    'date': fields.DateTime,
    'score': fields.Integer,
    'preference': fields.Integer
}

class ArticleList(Resource):
    @marshal_with(article_fields)
    def get(self):
        return list(mongo.db.hn2
                    .find({}, {'title': 1, 'link': 1, 'date': 1, 'score': 1, 'preference': 1})
                    .sort('date', pymongo.DESCENDING))

class ArticleView(Resource):
    @marshal_with(article_fields)
    def put(self, id):
        data = request.get_json(force=True)
        print(data)
        return mongo.db.hn2.find_one_and_update(
            {'_id': ObjectId(id)},
            {
                '$set': {
                    'preference': data['score']
                }
            },
            return_document=ReturnDocument.AFTER)



articles = Blueprint('articles', __name__)


