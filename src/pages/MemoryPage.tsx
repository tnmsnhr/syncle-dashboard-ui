import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import {
  useMemory,
  useCreateMemory,
  useUpdateMemory,
  useDeleteMemory,
  useToggleMemoryEnabled,
} from "../hooks/useMemory";
import type { MemoryCategory } from "../types";
import { formatDate } from "../utils/format";
import { getApiErrorMessage } from "../api/client";
import clsx from "clsx";

interface MemoryFormValues {
  key: string;
  value: string;
  category: MemoryCategory;
}

const categoryLabels: Record<MemoryCategory, string> = {
  profile: "Profile",
  preference: "Preference",
  domain: "Domain",
};

export function MemoryPage() {
  const { data, isLoading, isError, error, refetch } = useMemory();
  const createMutation = useCreateMemory();
  const updateMutation = useUpdateMemory();
  const deleteMutation = useDeleteMemory();
  const toggleEnabled = useToggleMemoryEnabled();
  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error ?? toggleEnabled.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MemoryFormValues>({
    defaultValues: { key: "", value: "", category: "profile" },
  });

  const onCreate = handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
    reset();
  });

  if (isLoading) {
    return (
      <div className="page-stack page-stack--narrow">
        <PageHeader />
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-stack page-stack--narrow">
        <PageHeader />
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader />

      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <p style={{ fontWeight: 600 }}>Memory enabled</p>
          <p className="text-small text-muted">
            When on, Syncle uses these facts to personalize summaries.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.enabled}
          onClick={() => toggleEnabled.mutate(!data.enabled)}
          className={clsx("toggle", data.enabled && "toggle--on")}
        >
          <span className="toggle__thumb" />
        </button>
      </div>

      {mutationError && (
        <p className="alert alert--error">{getApiErrorMessage(mutationError)}</p>
      )}

      <form onSubmit={onCreate} className="card page-stack">
        <h2 className="h3">Add memory item</h2>
        <div style={{ display: "grid", gap: "0.75rem" }} className="memory-form-grid">
          <Field label="Key">
            <input
              {...register("key", { required: true })}
              placeholder="e.g. role"
              className="input"
            />
          </Field>
          <Field label="Category">
            <select {...register("category")} className="select">
              {(Object.keys(categoryLabels) as MemoryCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Value">
          <textarea
            {...register("value", { required: true })}
            rows={3}
            placeholder="e.g. I am a frontend engineer"
            className="textarea"
          />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting || !data.enabled}
          className="btn btn--primary"
        >
          {isSubmitting ? "Adding…" : "Add item"}
        </button>
      </form>

      {data.items.length === 0 ? (
        <EmptyState
          title="No memory items"
          description="Add profile facts, preferences, or domain context to personalize summaries."
        />
      ) : (
        <ul className="page-stack" style={{ gap: "0.75rem" }}>
          {data.items.map((item) => (
            <MemoryItemRow
              key={item.id}
              item={item}
              disabled={!data.enabled}
              onUpdate={(patch) => updateMutation.mutate({ id: item.id, patch })}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <header className="page-header">
      <h1 className="h1">Memory</h1>
      <p className="page-header__desc">
        Store profile and preference context for smarter summaries.
      </p>
    </header>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  );
}

function MemoryItemRow({
  item,
  disabled,
  onUpdate,
  onDelete,
}: {
  item: {
    id: string;
    key: string;
    value: string;
    category: MemoryCategory;
    updatedAt: string;
  };
  disabled: boolean;
  onUpdate: (patch: Partial<{ key: string; value: string; category: MemoryCategory }>) => void;
  onDelete: () => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      key: item.key,
      value: item.value,
      category: item.category,
    },
  });

  return (
    <li className="card page-stack" style={{ gap: "0.75rem" }}>
      <form onSubmit={handleSubmit((values) => onUpdate(values))} className="page-stack" style={{ gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
          <span className="badge badge--neutral">{categoryLabels[item.category]}</span>
          <span className="text-xs">Updated {formatDate(item.updatedAt)}</span>
        </div>
        <div className="memory-form-grid">
          <input {...register("key")} disabled={disabled} className="input" />
          <select {...register("category")} disabled={disabled} className="select">
            {(Object.keys(categoryLabels) as MemoryCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>
        <textarea
          {...register("value")}
          rows={2}
          disabled={disabled}
          className="textarea"
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={disabled} className="btn btn--secondary btn--sm">
            Save
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (window.confirm("Delete this memory item?")) onDelete();
            }}
            className="btn btn--sm btn--danger"
          >
            Delete
          </button>
        </div>
      </form>
    </li>
  );
}

export default MemoryPage;
