import PlaidLink from "@/components/PlaidLink";
import { getSignedInUser } from "@/lib/actions/auth.actions";
import { linkTokenCreateAction } from "@/lib/actions/plaid/plaid.actions";

const Page = async () => {
  const userDoc = await getSignedInUser()
  const tempToken = await linkTokenCreateAction({userId: userDoc.$id, clientName: `${userDoc.firstName} ${userDoc.lastName}`})
  return (
    <div className="w-screen h-screen flex justify-center items-center flex flex-col">
      <PlaidLink user={userDoc} token={tempToken} variant="primary"/>
      <p className="mt-4">Connect your bank account to get started</p>
    </div>
  )
}
export default Page;