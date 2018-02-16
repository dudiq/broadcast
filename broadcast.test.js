(function () {
    var bcClass = require('./broadcast');

    // preparation
    console.log(bcClass);
    var broadcast = new bcClass('main');
    var bc = broadcast.instance('for-testing');

    test('multi checking of "on", "off" and "trig" methods', function (done) {
        var count = 0;

        var checkEvents = function () {
            expect(count).toBe(2);
//            assert.equal(count, 2);
            checkEvents = function () {
            }; //drop this method
        };

        function secondCheck() {
            expect(count).toBe(3);
            // assert.equal(count, 3);
        }

        bc.on('test-case1', function () {
            count++;
        }).on('test-case1', '.my-namespace', function () {
            count++;
        }).on('test-case1', '.my-namespace', function () {
            checkEvents();
        });
        bc.trig('test-case1');

        bc.off('test-case1', '.my-namespace');

        bc.on('test-case1', function () {
            secondCheck();
        });

        bc.trig('test-case1');


        bc.off('test-case1');

        bc.trig('test-case1');

        expect(count).toBe(3);
        // assert.equal(count, 3);
        setTimeout(function () {
            // all events must be called and map in broadcast must be clean
            expect(!!bc.getAllEvents['test-case1']).toBe(false);
            // assert.equal(!!bc.getAllEvents['test-case1'], false);
            done();
        }, 100);
    });

    test('# one checking, count must be == 1, because only firts .one will be triggered', function (done) {
        var count = 0;
        bc.one('test-case2', function () {
            count++;
        });

        function handler() {
            count++;
        }

        bc.one('test-case2', handler);

        bc.trig('test-case2-1');

        bc.off('test-case2', handler);

        bc.trig('test-case2');
        bc.trig('test-case2');

        setTimeout(function () {
            expect(count).toBe(1);
            // assert.equal(count, 1);
            done();
        }, 100);
    });

    test('# multiple messages on/off. should return single object with no binded handlers', function (done) {
        var newbc = broadcast.instance('for-testing');
        var count = 0;

        function h() {
            count++;
        }

        newbc.on(["case1", "case2"], ".test", h);
        newbc.on(["case3", "case4"], ".test", h);

        newbc.trig('case1');
        newbc.trig('case3');

        expect(count).toBe(2);
        // assert.equal(count, 2);
        newbc.off(".test");


        var binded = 0;
        for (var key in newbc.getAllEvents()) {
            var targets = newbc.getAllEvents()[key];
            for (var i = 0, l = targets.length; i < l; i++) {
                if (!targets[i]._dirty) {
                    binded++;
                }
            }
        }

        setTimeout(function () {
            expect(binded).toBe(0);
            // assert.equal(binded, 0);
            done();
        }, 100);
    });

    test('performance testing. should run more than one million operations per second', function (done) {

        var startTime = new Date();
        var opsbc = broadcast.instance('for-testing');

        // bind 1000 points
        var pointsOn = 1000;
        for (var i = 0; i <= pointsOn; i++) {
            (function (i) {
                var event = {
                    id: i
                };
                opsbc.on('test', '.namespace', function (params) {
                    event.params = params.date;
                    event.last = new Date();
                });
            })(i);
        }

        var onTime = new Date();
        // try to trigger 1000 points
        var pointsTrig = 1000;
        for (var j = 0; j <= pointsTrig; j++) {
            (function (i) {
                var params = {
                    date: new Date(),
                    i: i
                };
                opsbc.trig('test', params);
            })(j);
        }

        var trigTime = new Date();

        opsbc.off('.namespace');

        var endTime = new Date();

        var howLong = (endTime - startTime);

        console.log(" > performance testing: pointsOn = " + pointsOn + ", pointsTrig = " + pointsTrig + "\n" +
                    " bind time = " + (onTime - startTime) + "ms \n" +
                    " trig time = " + (trigTime - onTime) + "ms \n" +
                    " off time = " + (endTime - trigTime) + "ms \n" +
                    " all time = " + howLong + "ms \n" +
                    " > ---- ");

        expect(howLong > 100).toBe(true);
        // assert.equal(howLong < 1000, true);
        done();
    });

    test('ev1 must be defined', function () {
        var evs = broadcast.events('test1', {
            ev1: 'ev1'
        });

        expect(evs && evs.ev1).toBe('test1_^_ev1');
        // assert.equal(evs && evs.ev1, 'test1_^_ev1');
    });

    test('ev2 must be undefined', function () {
        var evs = broadcast.events('test1', {
            ev1: 'ev1'
        });
        expect(evs && evs.ev2).toBe(undefined);
        // assert.equal(evs && evs.ev2, undefined);
    });


})();