export type UiIconName =
  | 'heart'
  | 'users'
  | 'palette'
  | 'handshake'
  | 'hands'
  | 'money'
  | 'chart'
  | 'calendar'
  | 'camera'
  | 'video'
  | 'file'
  | 'clapper'
  | 'link'
  | 'factory'
  | 'pin'
  | 'phone'
  | 'globe'
  | 'lock'
  | 'fire'
  | 'bolt'
  | 'target'
  | 'school'
  | 'puzzle'
  | 'family'
  | 'printer'
  | 'truck'
  | 'party'
  | 'search'

const EMOJI_TO_ICON: Record<string, UiIconName> = {
  // Charity / main
  '🎨': 'palette',
  '👥': 'users',
  '💝': 'heart',
  '🤝': 'handshake',
  '🧩': 'puzzle',
  '🏫': 'school',
  '🤲': 'hands',
  '👨‍👩‍👧': 'family',
  '📝': 'file',
  '🖨️': 'printer',
  '🚚': 'truck',
  '🎉': 'party',

  // SupportView (filters / info)
  '🔥': 'fire',
  '⚡': 'bolt',
  '🔒': 'lock',
  '📊': 'chart',

  // Project detail / tabs / placeholders
  '📸': 'camera',
  '🎥': 'video',
  '📄': 'file',
  '🎬': 'clapper',
  '🔗': 'link',
  '🔍': 'search',
  '📅': 'calendar',
  '💰': 'money',

  // Partners / contact
  '🏭': 'factory',
  '📍': 'pin',
  '📱': 'phone',
  '🌐': 'globe',

  // support goals data.json
  '🚐': 'truck',
  '🍽️': 'hands',
  '📦': 'file',
  '💻': 'puzzle',
  '🏢': 'factory',
  '📢': 'bolt',
  '🎓': 'school',
  '🎯': 'target',

  // Organization projects / categories (/projects)
  '🏛️': 'school',
  '🏆': 'target',
  '♿': 'hands',
  '👨‍🏫': 'school',
  '🛠️': 'puzzle',
  '💬': 'bolt',
  '🚀': 'target',
  '🏅': 'target',
  '☀️': 'party',
  '🎪': 'party',
  '💡': 'bolt',
}

export function iconNameFromEmoji(value: string | null | undefined): UiIconName | undefined {
  if (!value) return undefined
  return EMOJI_TO_ICON[value]
}

