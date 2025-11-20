"use strict";

const TAG_RULES = [
  { tag: 'tutorial', cues: ['tutorial', 'how to', 'step by step', 'guide'] },
  { tag: 'tips', cues: ['tips', 'tricks', 'hacks', 'mistakes', 'avoid'] },
  { tag: 'resource', cues: ['resource', 'download', 'template', 'freebie', 'bundle', 'swipe'] },
  { tag: 'career', cues: ['career', 'job', 'resume', 'interview', 'portfolio'] },
  { tag: 'study', cues: ['study', 'notes', 'cheat sheet', 'exam', 'learn'] },
  { tag: 'ai', cues: ['ai', 'gpt', 'chatgpt', 'prompt'] },
  { tag: 'design', cues: ['design', 'ui', 'ux', 'figma'] }
];

const KEYWORD_PATTERNS = [
  /comment\s+["“']?([a-z0-9]+)["”']?/i,
  /drop\s+(?:the\s+)?word\s+["“']?([a-z0-9]+)["”']?/i,
  /type\s+["“']?([a-z0-9]+)["”']?\s+to\s+(?:get|receive|grab)/i,
  /reply\s+["“']?([a-z0-9]+)["”']?\s+below/i
];

export function classifyCaption(caption = '') {
  const text = caption.toLowerCase();
  const tags = [];

  TAG_RULES.forEach((rule) => {
    if (rule.cues.some((cue) => text.includes(cue))) {
      tags.push(rule.tag);
    }
  });

  return Array.from(new Set(tags));
}

export function extractCommentKeyword(caption = '') {
  const text = caption.toLowerCase();

  for (const pattern of KEYWORD_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
