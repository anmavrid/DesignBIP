# BIP (Behavior - Interaction - Priority)

BIP is a framework for the component-based design and analysis of software systems. It has been successfully used for modelling and analysis of a variety of case studies and applications, such as performance evaluation, modeling and analysis of TinyOS-based wireless sensor network applications, construction and verification of a robotic system. In the latter, the code generated by the tool-chain along with the BIP engine is used as a controller for the robot. The BIP framework also offers validation techniques for checking essential safety properties.

We present a design studio, developed using the WebGME tool, for the specification of BIP models using architecture diagrams, which is a graphical language that describes architecture styles with rigorous semantics. The WebGME-BIP design studio provides support for graphically defining and checking the consistency of BIP architecture models, integrating component behavior specifications, generating Java code from behavior and architecture specifications, and executing the BIP models with the integrated JavaBIP engine. 

* [More information about BIP](http://www-verimag.imag.fr/Rigorous-Design-of-Component-Based.html)
* [More information about JavaBIP](http://onlinelibrary.wiley.com/doi/10.1002/spe.2495/abstract)


## Quick Start
First, install the following:
- [NodeJS](https://nodejs.org/en/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/)

Then, install the command line interface of [webgme](https://github.com/webgme/webgme-cli).

Then, clone the `webgme-bip` repository and install packages with npm:
```
npm install
npm instal webgme
```

Start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Start the server locally
```
npm start
```

After the webgme server is up and there are no error messages in the console, open a valid address in the browser to start using the WebGME-BIP design studio. The default is http://127.0.0.1:8888/, you should see all valid addresses in the console.

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
First, install the following:
- [NodeJS](https://nodejs.org/en/download/) (v4.x.x recommended)
- [MongoDB](https://www.mongodb.com/download-center#production)

Install the command line interface version of webgme globally to your operating system:
```
npm install -g webgme-cli
```
(If you run `whereis webgme`, it should give you a location for the executable.)

To clone the repository, first install (if necessary):
- [Git](https://git-scm.com/downloads)

and then clone the repository in your preferred directory, for example:
```
cd /home/$USER
git clone https://github.com/anmavrid/webgme-bip.git
```
This makes the 'project root' for the git repo `/home/$USER/webgme-bip` (you can pick a different location for it besides `/home/$USER/` if you'd like).

Install packages with npm in the project root (`webgme-bip`):
```
cd /home/$USER/webgme-bip
npm install
npm install webgme
```
Start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`). For example:
```
cd /home/$USER
mkdir bip_data
mongodb --dbpath ./bip_data
```
wait until you see a line that says "[initandlisten] waiting for connections on port 27017".

Then, in a new terminal window, run `npm start` from the project root (`webgme-bip`) to start. For example:
```
cd /home/$USER/webgme-bip
npm start
```

After the webgme server is up and there are no error messages in the console, open a valid address in the browser to start using the WebGME-BIP design studio. The default is http://127.0.0.1:8888/, you should see all valid addresses in the console.

## Other information

If you would like to play around with "generic" `webgme`, you do not need to download and install it. WebGME-BIP contains `webgme` as a node_module and all "generic" visualization is included.

Links: [npm](https://www.npmjs.com/package/webgme-bip)
