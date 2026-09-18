export function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`press relative h-7 w-12 shrink-0 rounded-pill transition-colors ${checked ? 'bg-lime' : 'bg-white/12'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-pill bg-white transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
