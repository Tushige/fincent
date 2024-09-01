import { cn } from "@/lib/utils"

export const AppHeader = ({title, subText, ...props}: {
  title: string,
  subText?: string,
  className?: string
}) => {
  return (
    <div className={cn("flex flex-col gap-1", props.className)} {...props}>
      <h1 className="text-24 font-semibold text-2xl md:text-4xl">
        {title}
      </h1>
      <p className="">
        {subText}
      </p>
    </div>
  )
}
