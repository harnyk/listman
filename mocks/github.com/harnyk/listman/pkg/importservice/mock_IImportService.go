// Code generated by mockery v2.44.1. DO NOT EDIT.

package importservice_mock

import (
	context "context"

	entities "github.com/harnyk/listman/pkg/entities"
	importservice "github.com/harnyk/listman/pkg/importservice"

	mock "github.com/stretchr/testify/mock"
)

// MockIImportService is an autogenerated mock type for the IImportService type
type MockIImportService struct {
	mock.Mock
}

type MockIImportService_Expecter struct {
	mock *mock.Mock
}

func (_m *MockIImportService) EXPECT() *MockIImportService_Expecter {
	return &MockIImportService_Expecter{mock: &_m.Mock}
}

// CreateImportedList provides a mock function with given fields: ctx, list
func (_m *MockIImportService) CreateImportedList(ctx context.Context, list entities.ShoppingList) (string, error) {
	ret := _m.Called(ctx, list)

	if len(ret) == 0 {
		panic("no return value specified for CreateImportedList")
	}

	var r0 string
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context, entities.ShoppingList) (string, error)); ok {
		return rf(ctx, list)
	}
	if rf, ok := ret.Get(0).(func(context.Context, entities.ShoppingList) string); ok {
		r0 = rf(ctx, list)
	} else {
		r0 = ret.Get(0).(string)
	}

	if rf, ok := ret.Get(1).(func(context.Context, entities.ShoppingList) error); ok {
		r1 = rf(ctx, list)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// MockIImportService_CreateImportedList_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'CreateImportedList'
type MockIImportService_CreateImportedList_Call struct {
	*mock.Call
}

// CreateImportedList is a helper method to define mock.On call
//   - ctx context.Context
//   - list entities.ShoppingList
func (_e *MockIImportService_Expecter) CreateImportedList(ctx interface{}, list interface{}) *MockIImportService_CreateImportedList_Call {
	return &MockIImportService_CreateImportedList_Call{Call: _e.mock.On("CreateImportedList", ctx, list)}
}

func (_c *MockIImportService_CreateImportedList_Call) Run(run func(ctx context.Context, list entities.ShoppingList)) *MockIImportService_CreateImportedList_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context), args[1].(entities.ShoppingList))
	})
	return _c
}

func (_c *MockIImportService_CreateImportedList_Call) Return(_a0 string, _a1 error) *MockIImportService_CreateImportedList_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *MockIImportService_CreateImportedList_Call) RunAndReturn(run func(context.Context, entities.ShoppingList) (string, error)) *MockIImportService_CreateImportedList_Call {
	_c.Call.Return(run)
	return _c
}

// GetImportedListById provides a mock function with given fields: ctx, id
func (_m *MockIImportService) GetImportedListById(ctx context.Context, id string) (*importservice.ImportedList, error) {
	ret := _m.Called(ctx, id)

	if len(ret) == 0 {
		panic("no return value specified for GetImportedListById")
	}

	var r0 *importservice.ImportedList
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context, string) (*importservice.ImportedList, error)); ok {
		return rf(ctx, id)
	}
	if rf, ok := ret.Get(0).(func(context.Context, string) *importservice.ImportedList); ok {
		r0 = rf(ctx, id)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*importservice.ImportedList)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context, string) error); ok {
		r1 = rf(ctx, id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// MockIImportService_GetImportedListById_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetImportedListById'
type MockIImportService_GetImportedListById_Call struct {
	*mock.Call
}

// GetImportedListById is a helper method to define mock.On call
//   - ctx context.Context
//   - id string
func (_e *MockIImportService_Expecter) GetImportedListById(ctx interface{}, id interface{}) *MockIImportService_GetImportedListById_Call {
	return &MockIImportService_GetImportedListById_Call{Call: _e.mock.On("GetImportedListById", ctx, id)}
}

func (_c *MockIImportService_GetImportedListById_Call) Run(run func(ctx context.Context, id string)) *MockIImportService_GetImportedListById_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context), args[1].(string))
	})
	return _c
}

func (_c *MockIImportService_GetImportedListById_Call) Return(_a0 *importservice.ImportedList, _a1 error) *MockIImportService_GetImportedListById_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *MockIImportService_GetImportedListById_Call) RunAndReturn(run func(context.Context, string) (*importservice.ImportedList, error)) *MockIImportService_GetImportedListById_Call {
	_c.Call.Return(run)
	return _c
}

// NewMockIImportService creates a new instance of MockIImportService. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewMockIImportService(t interface {
	mock.TestingT
	Cleanup(func())
}) *MockIImportService {
	mock := &MockIImportService{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
