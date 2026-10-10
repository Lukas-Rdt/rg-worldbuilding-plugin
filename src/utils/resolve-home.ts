import os from "os"
import path from "path"

export function getHomeDir(): string {
  return process.env.HOME || os.homedir()
}

export function expandHome(value: string): string {
  const home = getHomeDir()
  if (value === "~") return home
  if (value.startsWith("~/") || value.startsWith("~\\")) {
    return path.join(home, value.slice(2))
  }
  return value
}

export function resolveTargetHome(value: unknown, defaultPath: string): string {
  if (!value) return defaultPath
  const raw = String(value).trim()
  if (!raw) return defaultPath
  return path.resolve(expandHome(raw))
}

export function resolveCodexHome(value: unknown): string {
  const home = process.env.HOME || os.homedir()
  const defaultPath = process.env.CODEX_HOME?.trim() || path.join(home, ".codex")
  return resolveTargetHome(value, path.resolve(expandHome(defaultPath)))
}
