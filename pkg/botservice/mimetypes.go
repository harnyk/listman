package botservice

import (
	"log"
	"mime"
)

var mimetypes = [][]string{
	{"audio/amr", "amr"},
	{"audio/amr-wb", "awb"},
	{"audio/annodex", "axa"},
	{"audio/basic", "au", "snd"},
	{"audio/csound", "csd", "orc", "sco"},
	{"audio/flac", "flac"},
	{"audio/midi", "mid", "midi", "kar"},
	{"audio/mpeg", "mpga", "mpega", "mp2", "mp3", "m4a"},
	{"audio/mpegurl", "m3u"},
	{"audio/ogg", "oga", "ogg", "opus", "spx"},
	{"audio/prs.sid", "sid"},
	{"audio/x-aiff", "aif", "aiff", "aifc"},
	{"audio/x-gsm", "gsm"},
	{"audio/x-mpegurl", "m3u"},
	{"audio/x-ms-wma", "wma"},
	{"audio/x-ms-wax", "wax"},
	{"audio/x-pn-realaudio", "ra", "rm", "ram"},
	{"audio/x-realaudio", "ra"},
	{"audio/x-scpls", "pls"},
	{"audio/x-sd2", "sd2"},
	{"audio/x-wav", "wav"},
}

func init() {
	log.Println("init mimetypes")
	for _, v := range mimetypes {
		typ := v[0]
		extensions := v[1:]

		for _, ext := range extensions {
			err := mime.AddExtensionType("."+ext, typ)
			if err != nil {
				log.Fatalf("mime: %s", err.Error())
			}
		}
	}
}
