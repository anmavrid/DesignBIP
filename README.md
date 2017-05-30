# BIP (Behavior - Interaction - Priority)
## Quick Start
First, install the following:
- [NodeJS](https://nodejs.org/en/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/)

Second, start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:8888` to start using the WebGME-BIP design studio!

## Alternative - No installation needed
The design studio can be accessed (read-only) directly [here](https://editor.webgme.org/?project=anastasia%2BBIP&node=%2Ff%2Ft)
, where you can see the Switchable Routes BIP project.

A non-read-only version of the design-studio can be accessed [here](https://editor.webgme.org/?project=demo%2BBIP_test&branch=master&node=%2Ff%2Ft&visualizer=BIPEditor&tab=0&layout=DefaultLayout).

If you would like to create your own, private BIP projects:
1. create a [WebGME account](WebGMEhttp://webgme.org/),
2. create a new project ( 3-minute tutorial for how to [create a project](http://www.youtube.com/watch?v=xR0rmcVFcgY&feature=youtu.be)),
3. use the BIP seed.

## Background material
* A general paper on [BIP](https://infoscience.epfl.ch/record/170496/files/ieee-software.pdf).

* A paper on [Architecture Diagrams](https://arxiv.org/pdf/1608.03324.pdf).

* A general tutorial on [modeling with WebGME](http://www.youtube.com/watch?v=YKi_256Vy_0&list=PLhvSjgKmeyjhp4_hnf-xPdCgES56dnMJb&index=3).

## Slower Start
WebGME is a a node.js application that uses mongodb. Ubuntu users can install nodejs and mongodb as follows:

```
sudo apt-get nodejs
sudo apt-get install npm
sudo apt-get install mongodb-server
```

`npm` is the Node.js package manager, that will allow you to easily install modules and packages to use with Node.js.

To clone the repository, first install git (if needed):

```
sudo apt-get install git
```

and then do:

```
git clone https://github.com/anmavrid/webgme-bip.git
```

Start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:8888` to start using the WebGME-BIP design studio!
