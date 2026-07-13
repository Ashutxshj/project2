"use client";

export interface DraftEntry<T = unknown> {
  id: string;
  savedAt: string;
  label: string;
  data: T;
}

function storageKey(tool: string) {
  return `coverle:drafts:${tool}`;
}

function autosaveKey(tool: string) {
  return `coverle:autosave:${tool}`;
}

export function loadAutosave<T>(tool: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(autosaveKey(tool));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveAutosave<T>(tool: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(autosaveKey(tool), JSON.stringify(data));
  } catch {
    /* storage full — ignore */
  }
}

export function clearAutosave(tool: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(autosaveKey(tool));
}

export function listDrafts<T>(tool: string): DraftEntry<T>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(tool));
    return raw ? (JSON.parse(raw) as DraftEntry<T>[]) : [];
  } catch {
    return [];
  }
}

export function saveDraft<T>(tool: string, data: T, label?: string): DraftEntry<T> {
  const drafts = listDrafts<T>(tool);
  const entry: DraftEntry<T> = {
    id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    label: label || `Draft ${new Date().toLocaleString()}`,
    data,
  };
  drafts.unshift(entry);
  try {
    window.localStorage.setItem(storageKey(tool), JSON.stringify(drafts.slice(0, 25)));
  } catch {
    /* ignore */
  }
  return entry;
}

export function deleteDraft(tool: string, id: string) {
  const drafts = listDrafts(tool).filter((d) => d.id !== id);
  window.localStorage.setItem(storageKey(tool), JSON.stringify(drafts));
}
