import { redirect } from "next/navigation"
import { PageHero } from "@/components/section"
import { LoginForm } from "@/components/auth-forms"
import { currentUser } from "@/lib/auth"

export const metadata = { title: "Sign in" }

export default async function LoginPage() {
  if (await currentUser()) redirect("/portal")

  return (
    <>
      <PageHero
        title="Customer sign in"
        description="Log in to check the progress of your transport requests."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x max-w-md">
          <LoginForm />
        </div>
      </section>
    </>
  )
}
