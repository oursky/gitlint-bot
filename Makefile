.PHONY: deploy-image deploy run-migrations

SHORT_SHA=$(shell git rev-parse --short=7 HEAD)
APP_IMAGE_NAME=gcr.io/oursky-kube/gitlint-bot:${SHORT_SHA}
POD_NAME = $(shell kubectl get pod -l app=gitlint-bot-production -o name)

deploy:
	@kubectl -n gitlint-bot apply -f ./k8s-deployment.yaml
	@kubectl -n gitlint-bot set image deployment/gitlint-bot-production gitlint-bot-production=${APP_IMAGE_NAME}

deploy-image:
	@docker build --tag ${APP_IMAGE_NAME} .
	@docker push ${APP_IMAGE_NAME}

run-migrations:
	@kubectl -n gitlint-bot exec ${POD_NAME} -- npm run migrations