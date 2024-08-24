
export const AppHeader = ({title, subText}: {
  title: string,
  subText: string
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-24 font-semibold text-slate-900">
        {title}
      </h1>
      <p className="">
        {subText}
      </p>
    </div>
  )
}
