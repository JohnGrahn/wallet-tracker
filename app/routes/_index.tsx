import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { getUserId } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/dashboard');
  } else {
    return redirect('/login');
  }
};

export default function Index() {
  return null;
}