
import os
from flask_admin import Admin
from api.database.db import db
from api.models.User import User
from api.models.Professional import Professional
from api.models.Activity import Activity
from api.models.Payments import Payments
from api.models.Globalrate import GlobalRate
from api.models.Favorite import Favorite
from flask_admin.contrib.sqla import ModelView



def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Professional, db.session))
    admin.add_view(ModelView(Activity, db.session))
    admin.add_view(ModelView(Payments, db.session))
    admin.add_view(ModelView(GlobalRate, db.session))
    admin.add_view(ModelView(Favorite, db.session))


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
