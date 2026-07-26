"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useDraft } from "@/components/builder/draft-provider";
import { Input } from "@/components/ui/input";
import { isValidUrl } from "@/lib/validate";
import type { SlinkyLink } from "@/lib/types";
import { cn } from "@/lib/cn";

function LinkRow({ link }: { link: SlinkyLink }) {
  const { updateLink, removeLink } = useDraft();
  const [touchedUrl, setTouchedUrl] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const urlInvalid = touchedUrl && link.url.trim() !== "" && !isValidUrl(link.url);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-start gap-3 border-[3px] border-ink bg-white p-3 shadow-brut",
        isDragging && "relative z-10 shadow-brut-lg",
        !link.active && "bg-ink/5",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`Reorder ${link.title || "untitled link"}`}
        className="mt-1 cursor-grab touch-none px-1.5 py-2 text-ink/40 hover:text-ink active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true">
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={3 + col * 8}
                cy={4 + row * 6}
                r="1.75"
                fill="currentColor"
              />
            )),
          )}
        </svg>
      </button>

      <div className="min-w-0 flex-1 space-y-2">
        <Input
          value={link.title}
          onChange={(e) => updateLink(link.id, { title: e.target.value })}
          placeholder="Link title"
          maxLength={80}
          aria-label="Link title"
          className="font-bold"
        />
        <Input
          value={link.url}
          onChange={(e) => updateLink(link.id, { url: e.target.value })}
          onBlur={() => setTouchedUrl(true)}
          placeholder="example.com/your-thing"
          inputMode="url"
          aria-label="Link URL"
          aria-invalid={urlInvalid || undefined}
        />
        {urlInvalid ? (
          <p className="text-sm font-bold text-hot" role="alert">
            That doesn&apos;t look like a usable web address.
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={link.active}
          aria-label={`${link.active ? "Hide" : "Show"} ${link.title || "untitled link"}`}
          onClick={() => updateLink(link.id, { active: !link.active })}
          className={cn(
            "h-7 w-12 border-[3px] border-ink p-0.5 shadow-brut-sm transition-colors",
            link.active ? "bg-mint" : "bg-white",
          )}
        >
          <span
            className={cn(
              "block h-full w-1/2 bg-ink transition-transform motion-reduce:transition-none",
              link.active && "translate-x-full",
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => removeLink(link.id)}
          aria-label={`Delete ${link.title || "untitled link"}`}
          className="border-[3px] border-ink bg-white px-2 py-1 text-xs font-bold uppercase shadow-brut-sm hover:bg-hot hover:text-white"
        >
          Del
        </button>
      </div>
    </li>
  );
}

export function LinkEditor() {
  const { draft, reorderLinks } = useDraft();
  const sensors = useSensors(
    // A small threshold keeps the handle clickable rather than instantly dragging.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = draft.links.findIndex((l) => l.id === active.id);
    const newIndex = draft.links.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    reorderLinks(arrayMove(draft.links, oldIndex, newIndex));
  }

  if (draft.links.length === 0) {
    return (
      <div className="border-[3px] border-dashed border-ink/40 bg-white/50 p-10 text-center">
        <p className="font-bold">No links yet.</p>
        <p className="mt-1 text-sm text-ink/60">
          Add your first one below — you can reorder them by dragging.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={draft.links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-3">
          {draft.links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
