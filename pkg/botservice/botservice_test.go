package botservice_test

import (
	"testing"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	aiservice_mock "github.com/harnyk/listman/mocks/github.com/harnyk/listman/pkg/aiservice"
	botservice_mock "github.com/harnyk/listman/mocks/github.com/harnyk/listman/pkg/botservice"
	importservice_mock "github.com/harnyk/listman/mocks/github.com/harnyk/listman/pkg/importservice"
	"github.com/harnyk/listman/pkg/botservice"
	"github.com/harnyk/listman/pkg/entities"
	"github.com/stretchr/testify/mock"
)

func TestBotService_HandleUpdate(t *testing.T) {
	fakeImportedListID := "123"
	fakeMessageID := 1000000
	fakeUserID := int64(100)
	fakeChatID := int64(1000)
	fakeUserName := "test_user"
	fakeChatTitle := "test_chat"
	fakeMessageText := "test"

	fakeMessage := &tgbotapi.Message{
		MessageID: fakeMessageID,
		Text:      fakeMessageText,
		From:      &tgbotapi.User{ID: fakeUserID, UserName: fakeUserName},
		Chat:      &tgbotapi.Chat{ID: fakeChatID, Title: fakeChatTitle},
	}

	fakeWebappUrl := "http://example.com"
	fakeShoppingList := &entities.ShoppingList{
		Title: "Title",
		Error: "",
		Items: []entities.ShoppingItem{
			{
				Name: "One",
				Note: "1",
			},
		},
	}

	// ----------------------------------

	mockTgAPI := botservice_mock.NewMockTgAPI(t)

	update := &tgbotapi.Update{Message: fakeMessage}

	mockAI := aiservice_mock.NewMockAIService(t)
	mockImport := importservice_mock.NewMockImportService(t)

	botSrv := botservice.New(
		botservice.NewBotServiceOptions().SetWebappUrl(fakeWebappUrl),
		mockAI,
		mockImport,
	)

	// ---------------------------------- EXPECTATIONS

	// Bot service should use the AI service to translate the fulltext message
	// into a structured shopping list
	mockAI.EXPECT().
		ParseShoppingList(mock.Anything, fakeMessageText).
		Return(fakeShoppingList, nil)

	// Bot service should use the import service to store the shopping list
	// in the database
	mockImport.EXPECT().
		CreateImportedList(mock.Anything, *fakeShoppingList).
		Return(fakeImportedListID, nil)

	// Bot service should reply with a link to the shopping list
	mockTgAPI.EXPECT().
		Send(tgbotapi.MessageConfig{
			BaseChat: tgbotapi.BaseChat{
				ChatID:           fakeChatID,
				ReplyToMessageID: fakeMessageID,
			},
			Text: fakeWebappUrl + "/imports/" + fakeImportedListID,
		}).
		Return(tgbotapi.Message{}, nil)

	// ---------------------------------- TEST

	botSrv.HandleUpdate(mockTgAPI, update)

	t.Cleanup(func() {
		mockAI.AssertExpectations(t)
		mockTgAPI.AssertExpectations(t)
		mockImport.AssertExpectations(t)
	})
}

func TestBotService_HandleUpdate_Voice(t *testing.T) {
	fakeImportedListID := "123"
	fakeMessageID := 1000000
	fakeUserID := int64(100)
	fakeChatID := int64(1000)
	fakeUserName := "test_user"
	fakeChatTitle := "test_chat"
	fakeVoiceFileID := "test_file_id"
	fakeMimeType := "audio/ogg"
	fakeFileDirectURL := "http://telega.fake/file"

	fakeMessage := &tgbotapi.Message{
		MessageID: fakeMessageID,
		From:      &tgbotapi.User{ID: fakeUserID, UserName: fakeUserName},
		Chat:      &tgbotapi.Chat{ID: fakeChatID, Title: fakeChatTitle},
		Text:      "",
		Voice:     &tgbotapi.Voice{FileID: fakeVoiceFileID, MimeType: fakeMimeType},
	}

	fakeWebappUrl := "http://example.com"
	fakeShoppingList := &entities.ShoppingList{
		Title: "Title",
		Error: "",
		Items: []entities.ShoppingItem{
			{
				Name: "One",
				Note: "1",
			},
		},
	}

	// ----------------------------------

	mockTgAPI := botservice_mock.NewMockTgAPI(t)

	update := &tgbotapi.Update{Message: fakeMessage}

	mockAI := aiservice_mock.NewMockAIService(t)
	mockImport := importservice_mock.NewMockImportService(t)

	// ---------------------------------- EXPECTATIONS

	// Bot service should use Telegram API to get the direct URL of the voice
	// message file
	mockTgAPI.EXPECT().
		GetFileDirectURL(fakeVoiceFileID).
		Return(fakeFileDirectURL, nil)

	// Bot service should use the AI service to translate the voice message
	// into text
	mockAI.EXPECT().
		GetTextFromVoice(mock.Anything, fakeFileDirectURL, "voice_message.oga").
		Return("One: 1", nil)

	// Bot service should use the AI service to translate the voice message
	// into a structured shopping list
	mockAI.EXPECT().
		ParseShoppingList(mock.Anything, mock.Anything).
		Return(fakeShoppingList, nil)

	// Bot service should use the import service to store the shopping list
	// in the database
	mockImport.EXPECT().
		CreateImportedList(mock.Anything, *fakeShoppingList).
		Return(fakeImportedListID, nil)

	// Bot service should reply with a text recognized from the voice message
	mockTgAPI.EXPECT().
		Send(tgbotapi.MessageConfig{
			BaseChat: tgbotapi.BaseChat{
				ChatID:           fakeChatID,
				ReplyToMessageID: fakeMessageID,
			},
			Text: "Processing your request: \n\nOne: 1",
		}).
		Return(tgbotapi.Message{}, nil)

	// Bot service should reply with a link to the shopping list
	mockTgAPI.EXPECT().
		Send(tgbotapi.MessageConfig{
			BaseChat: tgbotapi.BaseChat{
				ChatID:           fakeChatID,
				ReplyToMessageID: fakeMessageID,
			},
			Text: fakeWebappUrl + "/imports/" + fakeImportedListID,
		}).
		Return(tgbotapi.Message{}, nil)

	// ----------------------------------

	botSrv := botservice.New(
		botservice.NewBotServiceOptions().SetWebappUrl(fakeWebappUrl),
		mockAI,
		mockImport,
	)

	// ---------------------------------- TEST

	botSrv.HandleUpdate(mockTgAPI, update)

	t.Cleanup(func() {
		mockAI.AssertExpectations(t)
		mockTgAPI.AssertExpectations(t)
		mockImport.AssertExpectations(t)
	})
}
