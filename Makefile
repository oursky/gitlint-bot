.PHONY: deploy-image deploy run-migrations configure-docker ci upload-sourcemaps

SHORT_SHA=$(shell git rev-parse --short=7 HEAD)
APP_IMAGE_REPO=oursky/gitlint-bot
APP_IMAGE_LATEST=${APP_IMAGE_REPO}:latest
APP_IMAGE_SHA=${APP_IMAGE_REPO}:${SHORT_SHA}
SENTRY_RELEASE=${SHORT_SHA}

ci:
	@echo "Install dependencies"
	@npm ci
	@echo "Check code formatting"
	@npm run check-format
	@echo "Lint TypeScript"
	@npm run lint
	@echo "Run tests"
	@npm run test
	@echo "Build project"
	@npm run build

deploy: configure-docker deploy-image run-migrations
	@kubectl -n gitlint-bot apply -f ./deploy/k8s-deployment.yaml
	@kubectl -n gitlint-bot set image deployment/gitlint-bot-production gitlint-bot-production=${APP_IMAGE_SHA}

configure-docker: 
	@echo "${DOCKER_PASSWORD}" | docker login -u ${DOCKER_USERNAME} --password-stdin

deploy-image:
	@docker build -t ${APP_IMAGE_LATEST} -t ${APP_IMAGE_SHA} .
	@docker push ${APP_IMAGE_LATEST}
	@docker push ${APP_IMAGE_SHA}

run-migrations:
	@kubectl -n gitlint-bot delete job/gitlint-bot-db-migrations --ignore-not-found
	@kubectl -n gitlint-bot apply -f ./deploy/migrations-job.yaml
	@kubectl -n gitlint-bot wait --for=condition=complete job/gitlint-bot-db-migrations --timeout=30s

upload-sourcemaps:
	@npm run build
	@sentry-cli releases new ${SENTRY_RELEASE} --project ${SENTRY_PROJECT}
	@sentry-cli releases files ${SENTRY_RELEASE} upload-sourcemaps --ext js --ext map ./lib
	@sentry-cli releases finalize ${SENTRY_RELEASE}
	@sentry-cli releases deploys ${SENTRY_RELEASE} new -e ${SENTRY_DEPLOY_ENVIRONMENT} 