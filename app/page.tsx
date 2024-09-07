import { getSignedInUser } from "@/lib/actions/auth.actions";
import HomeUI from "@/components/HomeUI";

export default async function Home() {
  const user = await getSignedInUser()

  return (
    <section className="min-h-100vh bg-black">
      <HomeUI user={user} />
    </section>
  )
}

