.PHONY: deploy-image deploy

SHORT_SHA=$(shell git rev-parse --short=7 HEAD)
APP_IMAGE_NAME=gcr.io/oursky-kube/gitlint-bot:${SHORT_SHA}

deploy:
	@kubectl -n gitlint-bot apply -f ./k8s-deployment.yaml
	@kubectl -n gitlint-bot set image deployment/gitlint-bot-production gitlint-bot-production=${APP_IMAGE_NAME}

deploy-image:
	@docker build --tag ${APP_IMAGE_NAME} .
	@docker push ${APP_IMAGE_NAME}