.PHONY: test mock tgvercel

test:
	go test ./pkg/...
mock:
	mockery
tgvercel:
	go install github.com/harnyk/tgvercel@latest