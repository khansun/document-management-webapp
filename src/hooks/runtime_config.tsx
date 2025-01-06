import {RuntimeConfig} from "@/types/runtime_config"
import {useEffect, useState} from "react"

const RUNTIME_CONFIG_DEFAULT: RuntimeConfig = {
  ocr__lang_codes: "deu,eng,ron",
  ocr__default_lang_code: "eng",
  ocr__automatic: false
}

export function useRuntimeConfig(): RuntimeConfig {
  const [config, setConfig] = useState<RuntimeConfig>(RUNTIME_CONFIG_DEFAULT)

  useEffect(() => {
    if (window.hasOwnProperty("__DMS_RUNTIME_CONFIG__")) {
      setConfig(window.__DMS_RUNTIME_CONFIG__)
    }
  }, [JSON.stringify(window.__DMS_RUNTIME_CONFIG__)])

  return config
}