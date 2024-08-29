import PlaidLink from "@/components/PlaidLink";
import { getSignedInUser } from "@/lib/actions/auth.actions";
import { linkTokenCreateAction } from "@/lib/actions/plaid/plaid.actions";

const Page = async ({searchParams}: {
  searchParams?: {
    userId?: string
  }
}) => {
  const userDoc = await getSignedInUser(searchParams.userId)
  const tempToken = await linkTokenCreateAction({userId: userDoc.$id, clientName: `${userDoc.firstName} ${userDoc.lastName}`})
  return (
    <PlaidLink user={userDoc} token={tempToken} />
  )
}
export default Page;