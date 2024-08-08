import { useState } from 'react';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { createUser, createUserSession, getUserId } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return json({ error: 'Invalid form submission' }, { status: 400 });
  }

  const user = await createUser(email, password);

  if (!user) {
    return json({ error: 'User already exists' }, { status: 400 });
  }

  return createUserSession(user.id, '/dashboard');
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Registering...' : 'Register'}
        </button>
      </Form>
      {actionData?.error && (
        <p className="text-red-600 mt-4">{actionData.error}</p>
      )}
    </div>
  );
}