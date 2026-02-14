import React, { useState, useEffect } from 'react';

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
  initialToken?: string;
}

export const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit, initialToken = '' }) => {
  const [token, setToken] = useState(initialToken);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">GitHub API Token</h2>
      <div className="relative mb-4">
        <input
          type={isVisible ? "text" : "password"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span>Token is stored locally in your browser.</span>
        <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
          Generate Token
        </a>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
      >
        Load Rate Limits
      </button>
    </form>
  );
};
