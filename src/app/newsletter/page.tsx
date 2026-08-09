import { redirect } from 'next/navigation'

/** the index for both sources lives on the writing tab */
export default function NewsletterIndex() {
  redirect('/writing')
}
