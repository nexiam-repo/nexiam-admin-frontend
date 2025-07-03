import React from 'react';

import { SignInForm } from './SignInForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
