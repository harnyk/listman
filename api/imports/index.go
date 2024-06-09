package handler

import (
	"net/http"

	"github.com/harnyk/listman/pkg/factories"
	resp "github.com/nicklaw5/go-respond"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

func GetImportedListByIdHandler(w http.ResponseWriter, r *http.Request) {
	importsService := factories.ImportServiceFactory.Get()

	res := resp.NewResponse(w)

	id := r.URL.Query().Get("id")

	list, err := importsService.GetImportedListById(r.Context(), id)
	if err != nil {
		res.InternalServerError(&ErrorResponse{err.Error()})
		return
	}

	res.Ok(list)
}
