type LogLevel = 'info' | 'warn' | 'error'
type LogMeta = Record<string, unknown>

function cleanMeta(meta?: LogMeta): LogMeta | undefined {
  if (!meta) return undefined
  const entries = Object.entries(meta).filter(([, value]) => value !== undefined)
  return entries.length ? Object.fromEntries(entries) : undefined
}

function write(level: LogLevel, scope: string, message: string, meta?: LogMeta): void {
  const timestamp = new Date().toISOString()
  const payload = cleanMeta(meta)
  const text = `[${timestamp}] [${scope}] ${message}`
  const printer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  payload ? printer(text, payload) : printer(text)
}

export function logInfo(scope: string, message: string, meta?: LogMeta): void {
  write('info', `frontend:${scope}`, message, meta)
}

export function logWarn(scope: string, message: string, meta?: LogMeta): void {
  write('warn', `frontend:${scope}`, message, meta)
}

export function logError(scope: string, message: string, meta?: LogMeta): void {
  write('error', `frontend:${scope}`, message, meta)
}

export function logApiEvent(meta: {
  method: string
  url: string
  status?: number
  durationMs?: number
  attempt?: number
  requestId?: string | null
  error?: unknown
  retryInMs?: number
}): void {
  const { status, error, ...rest } = meta
  const normalizedError = error instanceof Error ? error.message : error
  const level: LogLevel =
    typeof status === 'number'
      ? status >= 500
        ? 'error'
        : status >= 400
          ? 'warn'
          : 'info'
      : normalizedError
        ? 'error'
        : 'info'

  const payload: LogMeta = {
    ...rest
  }

  if (typeof status === 'number') payload.status = status
  if (normalizedError !== undefined) payload.error = normalizedError

  write(level, 'frontend:api', `${meta.method.toUpperCase()} ${meta.url}`, payload)
}
