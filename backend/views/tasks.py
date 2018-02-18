from flask_restful import Resource, fields, marshal_with
from flask import Blueprint, request
from app import mongo
from pymongo import ReturnDocument
from bson.objectid import ObjectId


project_fields = {
    'id': fields.String(attribute='_id'),
    'title': fields.String,
    'color': fields.String,
    'deadline': fields.String,
    'parent': fields.String,
    'labelValues': fields.List(fields.String),
    'description': fields.String
}

task_fields = {
    'id': fields.String(attribute='_id'),
    'title': fields.String,
    'project': fields.String(attribute='parent'),
}

combined_view = {
    'projects': fields.Nested({
        'backlog': fields.List(fields.Nested(project_fields)),
        'inProgress': fields.List(fields.Nested(project_fields)),
        'done': fields.List(fields.Nested(project_fields)),
        'archieved': fields.List(fields.Nested(project_fields))
    }),
    'tasks': fields.Nested({
        'backlog': fields.List(fields.Nested(task_fields)),
        'inProgress': fields.List(fields.Nested(project_fields)),
        'done': fields.List(fields.Nested(project_fields)),
        'archieved': fields.List(fields.Nested(project_fields))
    })
}

class CombinedView(Resource):
    @marshal_with(combined_view)
    def get(self):
        return {
            'projects': {
                'backlog': list(mongo.db.projects.find({'lane': 'backlog'})),
                'inProgress': list(mongo.db.projects.find({'lane': 'inProgress'})),
                'done': list(mongo.db.projects.find({'lane': 'done'})),
                'archieved': list(mongo.db.projects.find({'lane': 'archieved'})),
            },
            'tasks': {
                'backlog': list(mongo.db.tasks.find({'lane': 'backlog'})),
                'inProgress': list(mongo.db.tasks.find({'lane': 'inProgress'})),
                'done': list(mongo.db.tasks.find({'lane': 'done'})),
                'archieved': list(mongo.db.tasks.find({'lane': 'archieved'})),
            }
        }

class ProjectsList(Resource):
    @marshal_with(project_fields)
    def post(self, kind):
        assert kind in ('projects', 'tasks')
        data = request.get_json(force=True)
        lane = 'backlog'
        if 'lane' in data:
            lane = data['lane']
        obj = {"lane": lane, "title": 'Untitled'}
        if 'parent' in data:
            obj['parent'] = data['parent']
        oid = mongo.db[kind].insert(obj)
        print("rval", {"id": oid, "lane": obj["lane"]})
        return {"_id": oid, "title": obj["title"]}


class ProjectView(Resource):
    @marshal_with(project_fields)
    def put(self, kind, id):
        assert kind in ('projects', 'tasks')

        data = request.get_json(force=True)
        print("aaa", data)
        updated_object = {}
        for prop in ('title', 'color', 'labelValues', 'deadline', 'description'):
            if prop in data['item']:
                print("update prop", prop, data['item'])
                updated_object[prop] =  data['item'][prop]
        if 'lane' in data:
            print("setting lane", data['lane'])
            updated_object['lane'] = data['lane']

        return mongo.db[kind].find_one_and_update(
            {'_id': ObjectId(id)},
            {
                '$set': updated_object,
                '$push': {
                    'history': updated_object
                }
            },
            return_document=ReturnDocument.AFTER)

    def delete(self, kind, id):
        assert kind in ('projects', 'tasks')

        mongo.db[kind].remove({'_id': ObjectId(id)})

tasks = Blueprint('tasks', __name__)


