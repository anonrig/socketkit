export default function Heading({ children, className }) {
  return (
    <div className="flex-1 min-w-0" className={className}>
      <h1 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">{children}</h1>
    </div>
  )
}
