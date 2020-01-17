# WebUIForROS
This repo contains code for a prototypical webbased UI that communicates with ROS and its arangoDB database

### PLEASE NOTE: As not all of the code for this project correctly can be shared here (e.g. the database and robot behaviors itself, the docker image) it is not working correctly. Also this project is still in an very early stage of development. ###

This repo contains the code for the webUI itself as well as some dummies I wrote for functionalities that are not already implemented on the robots. Furthermore it contains a flexBE behavior and some states that I currently use to test the communication loop between the robot and the WebUI.

Some functionalities the WebUI already offer or should offer in the future are:
- displaying what robot is currently doing (information is received via /robot_status topic
- easy starting of behaviors/tasks that are implemented on the robot with input of possibly needed parameters
- connection to the arangoDB knowledge-base of the robot (to access behaviors, known objects etc)
- translation of static content as well as the one from the database in English and German
- composing new tasks from tasks/capabilities that are already known to the robot

Currently the focus is to implement a stable base for the project, especially the working communication loop between the website and the robot. That means, that the website can trigger ROS (e.g. starting a behavior, changing if the robot is listening etc), as well as the other way around (ROS can command the website to show a modal if input is needed & sends information on current status).

Quick overview on what technologies are used:
- basic Web-technologies (no framework like react.js used yet)
- ROS (Python)
- arangoDB
- roslib.js (for communication with ROS)
- Docker
- FlexBE (as example state machine)
- small libraries like polyglot.js/leaderLine.js

### For more explanation on the project, visit [this site](https://www.portfoliomilena.com/post/developing-a-web-ui-for-service-robots) ###

