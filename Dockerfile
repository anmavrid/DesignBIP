# This will build the necessary webgme stack needed for plugin execution.
#
# 1. Copy this file to the root of your webgme repository (a clean copy, no node_modules, blobstorage etc.)
# 2. Build the image (tag should match the one in config.deployment.js image).
#     $ docker build -t webgme-docker-worker:0.1.1 .

## TODO: Add dependencies for BIP-engine
# JAVA JRE/(SDK?)
# Maven client
# BIP Engine

# https://github.com/nodejs/docker-node/blob/3b038b8a1ac8f65e3d368bedb9f979884342fdcb/6.9/Dockerfile
FROM node:boron

RUN mkdir /usr/app

WORKDIR /usr/app

# copy app source
ADD . /usr/app/

# Install the node-modules.
RUN npm install

# Needed only if webgme is a peerDependency
RUN npm install webgme

RUN cp /usr/app/node_modules/webgme-docker-worker-manager/dockerworker.js /usr/app/dockerworker.js