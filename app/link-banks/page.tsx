import PlaidLink from "@/components/PlaidLink";
import { linkTokenCreateAction } from "@/lib/actions/plaid.actions";
import { getUserById } from "@/lib/actions/users.actions";

const Page = async ({searchParams}: {
  searchParams?: {
    userId?: string
  }
}) => {
  const userId = searchParams?.userId || '';
  const user = await getUserById(userId)
  console.log(`[LINK BANK PAGE] this is user with id=${userId}`)
  console.log(user)
  const tempToken = await linkTokenCreateAction({userId: user.$id, clientName: `${user.firstName} ${user.lastName}`})
  console.log(`[LINK PAGE] got token ${tempToken}`)
  return (
    <PlaidLink user={user} token={tempToken} />
  )
}
export default Page;