import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const wallets = await prisma.wallet.findMany({ where: { userId } });
  return json({ wallets });
};

export default function Dashboard() {
  const { wallets } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Wallets</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{wallet.name}</h3>
            <p>Balance: {wallet.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}