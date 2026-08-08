import { redirect } from 'next/navigation'

/** The index lives on the writing tab, alongside the newsletter. */
export default function BlogIndex() {
  redirect('/writing')
}
