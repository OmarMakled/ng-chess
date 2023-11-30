.PHONY: up
up:
	@docker-compose up -d
	@docker-compose exec angular npm i --force
	@docker-compose exec angular npm run start

.PHONY: stop
stop:
	@docker-compose stop