.PHONY: test mock

test:
	go test ./pkg/...
mock:
	mockery