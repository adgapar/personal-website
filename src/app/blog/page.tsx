import { redirect } from 'next/navigation'

/** The index for both sources is the reader's contents page. */
export default function BlogIndex() {
  redirect('/reader')
}
