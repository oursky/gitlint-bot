.PHONY: deploy-image deploy

deploy:
	@kubectl -n gitlint-bot apply -f ./k8s-deployment.yaml

deploy-image:
	@docker build --tag gcr.io/oursky-kube/gitlint-bot:latest .
	@docker push gcr.io/oursky-kube/gitlint-bot:latest