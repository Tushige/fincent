import Image from 'next/image'

export const AppLogo = () => {
  return (
    <Image
      src={'/icons/logo.svg'}
      width={48}
      height={48}
      alt="Company Logo"
      className="relative left-[5px]"
    />
  )
}