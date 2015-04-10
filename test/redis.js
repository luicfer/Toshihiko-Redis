var Redis = require('../');
var should = require('should');

var redis = null;

describe('Array', function(){
    before(function () {
        redis = Redis.create('127.0.0.1:6379',{prefix:'_'});
    });
    describe('#_getKey', function(){
        it('should return key name', function(){
            redis._getKey('test', 'book', 1).should.eql('_test_book:1');
        });
    });
    describe('#setData', function () {
        it('should set data with return ok', function (done) {
            redis.setData('test','book',1,{name:'fuck'}, function (err,data) {
                data.should.eql('OK');
                done();
            })
        });
    });
});