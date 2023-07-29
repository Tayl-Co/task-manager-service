# task-manager-service

## Development

### Usage Example
1. First you must clone the project repository
```console
    git clone https://github.com/Tayl-Co/task-manager-service.git
```
2. Create the .env file

   - Use the [default.env](./default.env) with an example


3. Let’s start our application
   
   - Without Docker
     1. Navigate to the project folder
        ```console
            cd <rootfolder>/task-manager-service
        ```
     2. Install all dependencies
        ```console
            npm i
        ```
     3. Start the application
         ```console
            npm run start:dev
        ```
   
   - With Docker
     ```console
       docker-compose -f docker-compose.dev.yml up --build
     ```
### Test

#### E2E Test -
   1. First, create a test database
   2. Create an env file named ".env.test"
   3. Use the [default.env](./default.env) with an example
   4. Run the test
      ```console
        npm run test:e2e
      ```

#### Unit Test -
   1. Navigate to the project folder
      ```console
      cd <rootfolder>/task-manager-service
        ```
   2. Run the test command
      ```console
      npm run test
      ```
