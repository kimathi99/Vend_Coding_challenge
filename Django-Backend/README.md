Table of Contents
Prerequisites
Installation
Creating a Django Project
Running the Development Server
Creating Django Apps
Database Setup
Django Admin
Next Steps
Prerequisites
Before you begin, make sure you have the following installed:

Python (version 3.6 or higher)
pip (Python package manager)
Installation
You can install Django using pip. Open your terminal or command prompt and run the following command:

bash
Copy code
pip install Django
Creating a Django Project
Create a Project Directory: Choose a directory where you want to create your Django project and navigate to it using your terminal.

Create a Django Project: Run the following command to create a new Django project.

bash
Copy code
django-admin startproject projectname
Replace projectname with the name you want to give to your project.

Running the Development Server
Navigate to Project Directory: Change your terminal's directory to the one where your project was created:
bash
Copy code
cd projectname
Run the Development Server: Start the development server using the following command:
bash
Copy code
python manage.py runserver
By default, the server runs on http://127.0.0.1:8000/. You can access this URL in your web browser to see your Django project in action.

Creating Django Apps
Django is designed around the concept of modular apps. To create a new app:

Navigate to Project Directory: Ensure you are in your project's root directory.

Create a New App: Run the following command:

bash
Copy code
python manage.py startapp appname
Replace appname with the desired name for your app.

Database Setup
By default, Django uses SQLite as its database. To configure a different database, modify the DATABASES setting in settings.py.

Migrate Database: After defining your models, apply migrations to create database tables:
bash
Copy code
python manage.py makemigrations
python manage.py migrate
Django Admin
Django provides an admin panel for managing your application's data. To access it:

Create a Superuser: Run the following command to create an admin user:
bash
Copy code
python manage.py createsuperuser
Run the Server: Start the development server, and then visit http://127.0.0.1:8000/admin/ in your browser.