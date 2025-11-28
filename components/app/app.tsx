'use client';

import * as React from 'react';

import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { ConnectionProvider } from '@/hooks/useConnection';
import { useDebugMode } from '@/hooks/useDebug';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [resumeData, setResumeData] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      setResumeData(data.resume_extracted);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
          {error && (
            <div className="mb-4 rounded bg-red-500 p-2 text-center text-sm text-white">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Join Call
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ConnectionProvider 
      appConfig={appConfig} 
      metadata={JSON.stringify({ resume: resumeData, email: email })}
      onSessionEnd={() => setIsLoggedIn(false)}
    >
      <AppSetup />
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController appConfig={appConfig} />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </ConnectionProvider>
  );
}
