import os
import unittest

from src import create_app
from flask_script import Manager

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

app.app_context().push()

manager = Manager(app)

@manager.command
def run():
    app.run()

if __name__ == '__main__':
    manager.run()