interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isOpen: boolean
}

export default function SidebarItem({ icon, label, isOpen }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 cursor-pointer ${
        isOpen ? "justify-start" : "justify-center"
      }`}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </div>
  )
}
