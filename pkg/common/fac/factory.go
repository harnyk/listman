package fac

import "sync"

type Factory[T any] struct {
	init func() T
}

func New[T any](init func() T) *Factory[T] {
	return &Factory[T]{
		init: sync.OnceValue(init),
	}
}

func (f *Factory[T]) Get() T {
	return f.init()
}
