#!/bin/bash

# Dependancies:
# couchdb : an http dataservice installed locally on your machine and running on https (http://couchdb.apache.org/)
# erica : a deployment tool installed on your machine and availiable on the PATH (https://github.com/benoitc/erica)
# nodejs : a javascript server and package manager most recent version and installed from source and on your PATH (http://nodejs.org/download/)
# handlebars : a templating engine installed locally in the FieldDB project (see build_templates.sh for more details)

# Optional Dependancies for the minification (see build_fielddb_minified.sh for more details):
# requirejs installed locally in the FieldDB project (use the Node Package Manager, NPM)

# We will debug on a local couchdb
bash scripts/switch_to_develop_locally_offline.sh

# Optionally, if you have made changes to the html (handlebars templates)
bash scripts/build_templates.sh

# Optionally, if you have made changes to the activity feed widgets
#bash scripts/build_activity_feed.sh

# Optionally, minify if you want to test with minification
#bash scripts/build_fielddb_minified.sh

cd map_reduce_data
rm -rf _attachments
cp -r ../backbone_client _attachments

erica push  . https://admin:none@localhost:6984/public-firstcorpus

# Deploy app to the template corpus
erica push  . https://admin:none@localhost:6984/new_corpus

# Deploy app to the testing corpora
erica push  . https://admin:none@localhost:6984/testuser-firstcorpus

# deploy activity feeds too
cd ../map_reduce_activities

erica push  . https://admin:none@localhost:6984/public-firstcorpus-activity_feed
erica push  . https://admin:none@localhost:6984/public-activity_feed

erica push  . https://admin:none@localhost:6984/new_user_activity_feed
erica push  . https://admin:none@localhost:6984/new_corpus_activity_feed

erica push  . https://admin:none@localhost:6984/testuser-firstcorpus-activity_feed
erica push  . https://admin:none@localhost:6984/testuser-activity_feed
