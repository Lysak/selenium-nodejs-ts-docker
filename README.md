# Navigate to project root
cd /Users/Files/www/pet/selenium-node-ts-docker

# Build and start containers
```
cd /Users/Files/www/pet/selenium-node-ts-docker && docker-compose -f docker-compose.yml down && docker-compose -f docker-compose.yml up -d --build --remove-orphans && docker-compose -f docker-compose.yml logs -f
```

# Stop containers
docker-compose -f docker-compose.yml down

# View logs
docker-compose -f docker-compose.yml logs -f

#
docker-compose up --build

#
npm run start-test

#
npm run start
