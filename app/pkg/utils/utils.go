package utils

import "slices"

func StringToBool(str string) bool {
	trulyValues := []string{"1", "T", "t", "TRUE", "True", "true", "ON", "On", "on"}

	return slices.Contains(trulyValues, str)

}
