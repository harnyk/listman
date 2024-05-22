package aiservice

type ShoppingItem struct {
	Name string `json:"name"`
	Note string `json:"note"`
}

type ShoppingList struct {
	Items []ShoppingItem `json:"items"`
	Error string         `json:"error"`
}

func (sl *ShoppingList) HasError() bool {
	return sl.Error != ""
}

func (sl *ShoppingList) IsEmpty() bool {
	return len(sl.Items) == 0
}
