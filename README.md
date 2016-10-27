# CSC-4350_SWE
## Software Engineer 4350



####Setup Guide
### First you need to have [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/download-center?jmp=docs&_ga=1.25607093.905004982.1477408473#community) installed and setup. 

**NOTE** Setting up might differ from Windows and Apple


To set up MongoDB:

1. Go to the Mongodb website and download the MongoDB
2. Install it (default path should be in your C drive; C:\Program Files\MongoDB\Server\3.2\bin)
3. Create another folder with the name 'db'
4. Create a run.txt file and add the following to the file:
	*~~~~
	 echo off

	 mongod --dbpath=C:\Users\Larry\Documents\db
	 ~~~~
5. Note that the path should be where your db folder is
6. Go to your environment varible settings and add a new path the leads to the bin folder of where your original mongo is installed
7. Once everything is set. Change the extension to the run.txt file to run.bat
8. Double click it and it should add a bunch of files to your folder.
9. Now, everytime you wanna to start the Mongo server just run the run.bat file.


If there is any question. Please feel free to ask me.

