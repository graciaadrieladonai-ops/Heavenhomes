export function SearchBar({
  defaultValue = "",
  variant = "plain",
}: {
  defaultValue?: string;
  variant?: "hero" | "plain";
}) {
  const hero = variant === "hero";
  return (
    <form
      action="/#homes"
      method="get"
      className={`flex w-full overflow-hidden rounded-full ${hero ? "bg-white shadow-lg" : "border border-line bg-white"}`}
    >
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search city, address, or home…"
        className={`min-w-0 flex-1 bg-transparent px-5 py-3.5 outline-none ${hero ? "text-ink" : ""}`}
        aria-label="Search homes"
      />
      <button
        type="submit"
        className={`m-1.5 shrink-0 rounded-full px-5 py-2.5 text-sm font-medium ${hero ? "bg-sage text-white hover:bg-sage-2" : "bg-ink text-white hover:bg-sage"}`}
      >
        Search
      </button>
    </form>
  );
}
