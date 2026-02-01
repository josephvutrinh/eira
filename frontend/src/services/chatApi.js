export function buildSupportReply(userText) {
  const text = (userText || '').toLowerCase()

  // Keep responses supportive and non-medical; gently encourage professional care when needed.
  if (text.includes('hot flash') || text.includes('hot flashes')) {
    return "That sounds really uncomfortable. Hot flashes can be exhausting. If you want, you can log when they happen (time, intensity, triggers like caffeine/alcohol/stress) and we can look for patterns. If symptoms feel severe or are changing quickly, consider checking in with a clinician."
  }

  if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired')) {
    return "Sleep disruption is very common around perimenopause/menopause. If you’d like, tell me what your nights look like (bedtime, wake-ups, night sweats, stress level) and we can brainstorm gentle routines to try. If you’re feeling unsafe, extremely depressed, or unable to function, it’s important to seek professional support."
  }

  if (
    text.includes('anx') ||
    text.includes('panic') ||
    text.includes('mood') ||
    text.includes('depress')
  ) {
    return "I’m here with you. Mood changes can feel intense and isolating. If you can, share what you’re noticing (when it started, what helps, what makes it worse). If you’re thinking about harming yourself or feel in danger, please call local emergency services right now."
  }

  if (text.includes('help') || text.includes('support')) {
    return "I’m here to support you. What’s the biggest thing you want help with today—symptoms, sleep, stress, or tracking what you’re experiencing?"
  }

  return "Thanks for sharing that. I’m here with you. If you tell me a bit more about what you’re experiencing (what, when it started, how often, how intense), I can help you organize it for your symptom log and suggest questions to bring to a clinician."
}
