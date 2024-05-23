package env

import (
	"errors"
	"fmt"
	"os"
)

var ErrEmptyEnv = errors.New("environment variable is empty")

func Get(key string) (string, error) {
	value, ok := os.LookupEnv(key)
	if !ok {
		return "", fmt.Errorf("looking up env var %s: %w", key, ErrEmptyEnv)
	}
	return value, nil
}

func MustGet(key string) string {
	value, err := Get(key)
	if err != nil {
		panic(err)
	}
	return value
}
