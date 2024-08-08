import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Form,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getUserId } from "~/utils/auth.server";
import "./tailwind.css";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return json({ isLoggedIn: !!userId });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Crypto Wallet Tracker</h1>
            <nav>
              <ul className="flex space-x-4">
                {isLoggedIn ? (
                  <>
                    <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
                    <li>
                      <Form action="/logout" method="post">
                        <button type="submit" className="hover:underline">Logout</button>
                      </Form>
                    </li>
                  </>
                ) : (
                  <>
                    <li><a href="/login" className="hover:underline">Login</a></li>
                    <li><a href="/register" className="hover:underline">Register</a></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto mt-8 px-4">
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}