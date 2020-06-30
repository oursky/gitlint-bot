.PHONY: deploy-image deploy configure-docker ci decrypt-blackbox

SHORT_SHA=$(shell git rev-parse --short=7 HEAD)
APP_IMAGE_REPO=oursky/gitlint-bot
APP_IMAGE_LATEST=${APP_IMAGE_REPO}:latest
APP_IMAGE_SHA=${APP_IMAGE_REPO}:${SHORT_SHA}

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

deploy: decrypt-blackbox configure-docker deploy-image
	@helm upgrade gitlint-bot deploy/helm \
		--cleanup-on-fail \
		-n gitlint-bot \
		-f deploy/helm/values.yaml \
		--set appVersion=${SHORT_SHA} \
		--install 

configure-docker: 
	@echo "${DOCKER_PASSWORD}" | docker login -u ${DOCKER_USERNAME} --password-stdin

deploy-image:
	@docker build -t ${APP_IMAGE_LATEST} -t ${APP_IMAGE_SHA} .
	@docker push ${APP_IMAGE_LATEST}
	@docker push ${APP_IMAGE_SHA}

decrypt-blackbox:
	@git clone --branch stable --depth 1 https://github.com/StackExchange/blackbox.git "${HOME}/.blackbox" && export PATH="${HOME}/.blackbox/bin:${PATH}"
	@echo "${OURSKY_FASENG_GPG}" | gpg --import
	@blackbox_postdeploy