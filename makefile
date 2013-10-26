# Setup the project
setup:
	git init
	
	git submodule add git@github.com:hi-res/theoricus.git vendors/theoricus

	git submodule update --init
	cd vendors/theoricus && npm install

	git flow init

# Track all remotes
track_all:
	for remote in `git branch -r | grep -v master `; do git checkout --track $$remote ; done

# Start the theoricus server	
server:
	vendors/theoricus/bin/the -s
