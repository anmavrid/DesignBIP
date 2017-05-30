/*jshint node:true, mocha:true*/
/**
 * Generated by PluginGenerator 1.7.0 from webgme on Wed Mar 08 2017 15:24:49 GMT-0600 (Central Standard Time).
 */

'use strict';
var testFixture = require('../../globals');

describe('BehaviorSpecGenerator', function () {
    var gmeConfig = testFixture.getGmeConfig(),
        expect = testFixture.expect,
        logger = testFixture.logger.fork('BehaviorSpecGenerator'),
        PluginCliManager = testFixture.WebGME.PluginCliManager,
        projectName = 'testProject',
        pluginName = 'BehaviorSpecGenerator',
        project,
        gmeAuth,
        storage,
        commitHash;

    before(function (done) {
        testFixture.clearDBAndGetGMEAuth(gmeConfig, projectName)
            .then(function (gmeAuth_) {
                gmeAuth = gmeAuth_;
                // This uses in memory storage. Use testFixture.getMongoStorage to persist test to database.
                storage = testFixture.getMemoryStorage(logger, gmeConfig, gmeAuth);
                return storage.openDatabase();
            })
            .then(function () {
                var importParam = {
                    projectSeed: testFixture.path.join(__dirname, 'Behavior_violations.webgmex'),
                    projectName: projectName,
                    branchName: 'master',
                    logger: logger,
                    gmeConfig: gmeConfig
                };

                return testFixture.importProject(storage, importParam);
            })
            .then(function (importResult) {
                project = importResult.project;
                commitHash = importResult.commitHash;
                return project.createBranch('test', commitHash);
            })
            .nodeify(done);
    });

    after(function (done) {
        storage.closeDatabase()
            .then(function () {
                return gmeAuth.unload();
            })
            .nodeify(done);
    });

    it('should succeed on valid model', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/1',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(err).to.equal(null);
                expect(typeof pluginResult).to.equal('object');
                expect(pluginResult.success).to.equal(true);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on no initial state', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/p',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(6);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on duplicated transition name', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/o',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(8);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on duplicated guard name', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/i',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(9);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on duplicated state name', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/R',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(10);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on non-defined transition methods', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/K',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(7);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on non-defined guard reference', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/Y',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(8);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on non-defined src and dst of transitions', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/J',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(9);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });

    it('should fail on space in component names', function (done) {
        var manager = new PluginCliManager(null, logger, gmeConfig),
            pluginConfig = {
            },
            context = {
                project: project,
                commitHash: commitHash,
                branchName: 'test',
                activeNode: '/f/t/m',
            };

        manager.executePlugin(pluginName, pluginConfig, context, function (err, pluginResult) {
            try {
                expect(pluginResult.success).to.equal(false);
                //expect(pluginResult).to.deep.equal({});
                expect(pluginResult.error).to.include('violation(s)');
                expect(pluginResult.messages.length).to.equal(7);
                done();
            }
            catch(e) {
                done(e);
            }
        });
    });
});
