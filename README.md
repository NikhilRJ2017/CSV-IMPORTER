# Welcome to CSV IMPORTER API!

These APIs will parse specific CSV files and export the content to MongoDB by creating different collections. You can also perform CRUD operations on the expoted data.


## Steps to install locally
Before installing npm modules and run the project, create '.env' file into the project with following entries:

- MONGODB_URL=your mongo db server url
- PORT=add value

Althought fallback has been provided for PORT, it is advisable to add your own values

Now run following commands on the terminal:

 - npm install && npm install nodemon -D && npm start

Voila! Server will start running on port 5000 (default)
