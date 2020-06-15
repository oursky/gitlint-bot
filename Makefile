.PHONY: deploy-image deploy run-migrations

SHORT_SHA=$(shell git rev-parse --short=7 HEAD)
APP_IMAGE_REPO=gcr.io/oursky-kube/gitlint-bot
APP_IMAGE_LATEST=${APP_IMAGE_REPO}:latest
APP_IMAGE_SHA=${APP_IMAGE_REPO}:${SHORT_SHA}

deploy:
	@kubectl -n gitlint-bot apply -f ./deploy/k8s-deployment.yaml
	@kubectl -n gitlint-bot set image deployment/gitlint-bot-production gitlint-bot-production=${APP_IMAGE_SHA}

deploy-image:
	@docker build -t ${APP_IMAGE_LATEST} -t ${APP_IMAGE_SHA} .
	@docker push ${APP_IMAGE_LATEST}
	@docker push ${APP_IMAGE_SHA}