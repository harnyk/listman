package botservice

type BotServiceOptions struct {
	WebappUrl string
}

func NewBotServiceOptions() *BotServiceOptions {
	return &BotServiceOptions{}
}

func (o *BotServiceOptions) SetWebappUrl(url string) *BotServiceOptions {
	o.WebappUrl = url
	return o
}
