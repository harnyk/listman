package fac_test

import (
	"sync"
	"testing"

	"github.com/harnyk/listman/pkg/common/fac"
)

func TestFactorySingleton(t *testing.T) {
	counter := 0
	factory := fac.New(func() int {
		counter++
		return counter
	})

	if factory.Get() != 1 {
		t.Errorf("Expected factory.Get() to return 1, got %d", factory.Get())
	}

	if factory.Get() != 1 {
		t.Errorf("Expected factory.Get() to return 1, got %d", factory.Get())
	}

	if counter != 1 {
		t.Errorf("Expected counter to be 1, got %d", counter)
	}
}

func TestFactoryConcurrency(t *testing.T) {
	counter := 0
	factory := fac.New(func() int {
		counter++
		return counter
	})

	const goroutines = 100
	var wg sync.WaitGroup
	wg.Add(goroutines)

	results := make(chan int, goroutines)

	for i := 0; i < goroutines; i++ {
		go func() {
			defer wg.Done()
			results <- factory.Get()
		}()
	}

	wg.Wait()
	close(results)

	firstResult := <-results
	for result := range results {
		if result != firstResult {
			t.Errorf("Expected all results to be %d, but got %d", firstResult, result)
		}
	}

	if counter != 1 {
		t.Errorf("Expected counter to be 1, got %d", counter)
	}
}
