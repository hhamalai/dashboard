import flask_restful
from app import app
from views.articles import articles, ArticleList, ArticleView
from views.tasks import tasks, ProjectView, CombinedView, ProjectsList

api = flask_restful.Api(app)
api_root = '/api/v1'
api.add_resource(ArticleList, api_root + '/articles')
api.add_resource(ArticleView, api_root + '/articles/<string:id>')
api.add_resource(CombinedView, api_root + '/todo')
api.add_resource(ProjectsList, api_root + '/todo/<string:kind>')
api.add_resource(ProjectView, api_root + '/todo/<string:kind>/<string:id>')


app.register_blueprint(articles)
app.register_blueprint(tasks)

@app.route('/')
def index():
    return app.send_static_file('index.html')
