package configs

import (
	"errors"
	"os"
	"sync"

	"github.com/knadh/koanf/parsers/yaml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var Configs = koanf.New(".")
var once sync.Once

func InitConfigs() {
	once.Do(func() {
		if err := Configs.Load(file.Provider(".env.yml"), yaml.Parser()); err != nil {
			panic(err)
		}

		if err := Configs.Load(file.Provider(".env.local.yml"), yaml.Parser()); err != nil {
			if !errors.Is(err, os.ErrNotExist) {
				panic(err)
			}
		}
	})
}
