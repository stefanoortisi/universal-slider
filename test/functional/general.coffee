should = do (require 'chai').should
coffee = require 'coffee-script'

exports.test = ( pivot ) ->

  foofunk  = ->
  listener = {}

  describe '[key-> value storage]', ->

    it 'it should store a value', (done)->

        pivot.set 'key', 'value'
        done()

    it 'it should retrieve a value', (done)->

        (pivot.get 'key').should.equal 'value'

        done()

  describe '[event system]', ->

    it 'it should register an event', (done) ->

        pivot.on 'event', ->
        done()

    it 'it should propagate an event', (done)->

        pivot.on 'changed:name', foofunk
        pivot.on 'changed:name', -> done()

        pivot.trigger 'changed:name', 'foo'

    it 'it should unregister event', (done)->

        pivot.off( 'changed:name', foofunk ).should.equal true

        done()


  # describe '[include/extend]', ->

  #   it 'i should write this test', (done)->
  #       # should.not.exist err
  #       done()