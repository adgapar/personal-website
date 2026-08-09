import { redirect } from 'next/navigation'

/** the index for both sources is the reader's contents page */
export default function NewsletterIndex() {
  redirect('/reader')
}
