.PHONY: deploy-image

GIT_SHA := $(shell git rev-parse --short=7 HEAD)
deploy-image:
	@docker build --tag gcr.io/oursky-kube/gitlint-bot:$(GIT_SHA) .
	@docker push gcr.io/oursky-kube/gitlint-bot:$(GIT_SHA)