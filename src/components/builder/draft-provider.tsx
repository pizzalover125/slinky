"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  emptyDraft,
  loadDraft,
  newLink,
  reindex,
  saveDraft,
} from "@/lib/draft";
import { MAX_LINKS_PER_PAGE, type DraftPage, type SlinkyLink } from "@/lib/types";

interface DraftContextValue {
  draft: DraftPage;
  /** False until localStorage has been read, so we don't flash an empty page. */
  hydrated: boolean;
  update: (patch: Partial<DraftPage>) => void;
  addLink: () => void;
  updateLink: (id: string, patch: Partial<SlinkyLink>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: SlinkyLink[]) => void;
  reset: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({
  children,
  initial,
  persist = true,
}: {
  children: React.ReactNode;
  /** Seed for editing an already-published page. */
  initial?: DraftPage;
  /**
   * localStorage backing. On for the signed-out builder; off when editing a
   * saved page, where the database is the source of truth and a stray draft
   * would leak one page's edits into another's.
   */
  persist?: boolean;
}) {
  const [draft, setDraft] = useState<DraftPage>(initial ?? emptyDraft);
  const [hydrated, setHydrated] = useState(!persist);

  // Read once on mount rather than lazily in useState — localStorage isn't
  // available during SSR, so reading it in the initializer would produce a
  // client tree that doesn't match the server's and break hydration.
  useEffect(() => {
    if (!persist) return;
    // Pulling client-only storage into React state on mount is the external-
    // system sync this hook exists for. It runs once and `hydrated` gates the
    // render, so there's no cascading-render risk the rule guards against.
    /* eslint-disable react-hooks/set-state-in-effect */
    setDraft(loadDraft() ?? emptyDraft());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [persist]);

  useEffect(() => {
    if (persist && hydrated) saveDraft(draft);
  }, [draft, hydrated, persist]);

  const update = useCallback((patch: Partial<DraftPage>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const addLink = useCallback(() => {
    setDraft((d) =>
      d.links.length >= MAX_LINKS_PER_PAGE
        ? d
        : {
            ...d,
            links: reindex([...d.links, newLink({ position: d.links.length })]),
          },
    );
  }, []);

  const updateLink = useCallback((id: string, patch: Partial<SlinkyLink>) => {
    setDraft((d) => ({
      ...d,
      links: d.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }, []);

  const removeLink = useCallback((id: string) => {
    setDraft((d) => ({
      ...d,
      links: reindex(d.links.filter((l) => l.id !== id)),
    }));
  }, []);

  const reorderLinks = useCallback((links: SlinkyLink[]) => {
    setDraft((d) => ({ ...d, links: reindex(links) }));
  }, []);

  const reset = useCallback(() => setDraft(emptyDraft()), []);

  const value = useMemo(
    () => ({
      draft,
      hydrated,
      update,
      addLink,
      updateLink,
      removeLink,
      reorderLinks,
      reset,
    }),
    [draft, hydrated, update, addLink, updateLink, removeLink, reorderLinks, reset],
  );

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside <DraftProvider>");
  return ctx;
}
