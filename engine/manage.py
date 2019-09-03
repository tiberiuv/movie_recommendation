import os
import unittest

from src import create_app
from src.api import api
from flask_script import Manager

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')
app.register_blueprint(api)

app.app_context().push()

manager = Manager(app)

@manager.command
def run():
    app.run(use_reloader=False)

if __name__ == '__main__':
    manager.run()