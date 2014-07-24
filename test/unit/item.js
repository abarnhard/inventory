/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var connect = require('../../app/lib/connect');
var Mongo = require('mongodb');
var Item;

describe('Item', function(){
  before(function(done){
    connect('inventory-test', function(){
      Item = require('../../app/models/item');
      done();
    });
  });
  beforeEach(function(done){
    global.mongodb.collection('items').remove(function(){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new instance of Item', function(){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');

      expect(tv).to.be.ok;
      expect(tv.name).to.equal('tv');
      expect(tv.room).to.equal('living room');
      expect(typeof tv.acquired).to.equal('object');
      expect(tv.count).to.equal(1);
      expect(tv.cost).to.equal(900);
    });
  });
  describe('#save', function(){
    it('should save an item to the database', function(done){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');

      tv.save(function(){
        expect(tv._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('#value', function(){
    it('should return the total value of an item', function(){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');

      expect(tv.value()).to.equal(900);
    });
  });
  describe('.find', function(){
    it('should find all objects in the dbase collection', function(done){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');
      var hat = new Item('hat', 'closet', '4/29/2013', '1', '20');

      tv.save(function(){
        hat.save(function(){
          Item.find({}, function(items){
            expect(items).to.have.length(2);
            done();
          });
        });
      });
    });
    it('should find the objects matching the search term', function(done){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');
      var hat = new Item('hat', 'closet', '4/29/2013', '1', '20');

      tv.save(function(){
        hat.save(function(){
          Item.find({name:'tv'}, function(items){
            expect(items).to.have.length(1);
            done();
          });
        });
      });
    });
  });
  describe('.value', function(){
    it('should return the value of all items in a room', function(done){
      var tv = new Item('tv', 'living room', '2/19/2013', '1', '900');
      var hat = new Item('hat', 'closet', '4/29/2013', '1', '20');
      var couch = new Item('couch', 'living room', '2/19/2013', '1', '3000');
      var chair = new Item('chair', 'living room', '4/29/2013', '4', '200');

      tv.save(function(){
        hat.save(function(){
          couch.save(function(){
            chair.save(function(){
              Item.value({room:'living room'}, function(value){
                expect(value).to.equal(4700);
                done();
              });
            });
          });
        });
      });
    });
  });

});
