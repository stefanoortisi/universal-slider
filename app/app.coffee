# global shortcuts
# 
# 
delay    = ( time, funk ) -> setTimeout funk, time

interval = ( time, funk ) -> setInterval funk, time


# global modifiers ( invertors )
# 
# 
didnt = hasnt = ( what ) -> not what



# Application
# 
# 
class app.App extends theoricus.Theoricus

  constructor: ->
    # don't forget to extend Theoricus
    super()

    # ~> do your stuff 

    # start dealing with page requests
    @start()

# initialize your app
new app.App()