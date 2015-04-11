var Redis = require('../');
var should = require('should');

var redis = null;

describe('Array', function(){
    before(function () {
        redis = Redis.create('127.0.0.1:6379',{prefix:'_'});
    });
    beforeEach(function (done) {
        redis.setData('test','book',2,{name:'2'}, function (err,data) {
            data.should.eql('OK');
            done();
        })
    });
    describe('#_getKey', function(){
        it('should return key name', function(){
            redis._getKey('test', 'book', 1).should.eql('_test_book:1');
        });
    });
    describe('#setData', function () {
        it('should set data with return ok', function (done) {
            redis.setData('test','book',1,{name:'1'}, function (err,data) {
                data.should.eql('OK');
                done();
            })
        });
    });
    describe('#getData', function () {
        it('should return one data', function (done) {
            redis.getData('test','book',1, function (err,data) {
                data.should.be.an.Array;
                data.should.eql([{name:'1'}]);
                done();
            })
        });
        it('should return an array data', function (done) {
            redis.getData('test','book',[1,2], function (err,data) {
                data.should.be.an.Array;
                data.should.have.length(2);
                data.should.eql([{name:'1'},{name:'2'}]);
                done();
            })
        });
    });

    describe('#deleteData', function () {
        it('should delete Data with return 1', function (done) {
            redis.deleteData('test','book',2, function (err,data) {
                data.should.eql(1);
                done();
            })
        });
    });

    describe('#deleteKeys', function () {
        it('should delete Data with return array res', function (done) {
            redis.deleteKeys('test','book',[1,2], function (err,data) {
                data.should.be.an.Array;
                data.should.eql([1,1]);
                done();
            })
        });
    });
});