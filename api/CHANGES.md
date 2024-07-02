# CHANGES

## Login Route
- Created login.service to handle the internal logic of:
   - verifying the user exists
   - verifying the entered password is correct
   - finding or creating a new session
- Created login.controller to handle the request from the client
   - the controller is responsible for passing data to the service
   - it also returns a status dependent upon the results of the service