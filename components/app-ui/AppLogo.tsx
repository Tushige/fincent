import Image from 'next/image'

export const AppLogo = () => {
  return (
    <Image
      src={'/icons/logo.svg'}
      width={38}
      height={38}
      alt="Company Logo"
    />
  )
}